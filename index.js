const {createKey} = require('./lib/utils');
const {getStoreProvider} = require('./lib/storeProviders');

const storeResponse = (idempotencyKey, store, ctx) => {
  const {path} = ctx.request;
  const {status, body, header} = ctx.response;
  const response = {status, body, header};

  store.set(createKey(path, body, idempotencyKey), response);
}

const checkStoreRoot = (getStoreProvider, createKey) => async (storeOptions, idempotencyKey, ctx, next) => {
  const {path, body: reqBody} = ctx.request;
  const store = getStoreProvider(storeOptions);
  const cachedResponse = store.get(createKey(path, reqBody, idempotencyKey));

  if(!cachedResponse) {
    await next();
    return storeResponse(idempotencyKey, store, ctx);
  }

  const {status, body: resBody, header} = cachedResponse;
  ctx.status = status;
  ctx.body = resBody;
  ctx.set(header);
  ctx.set('X-Cache', 'HIT');
}

const idempotenceRoot = checkStore => (opts={}) => async (ctx, next) => {
  const {storeOptions} = opts;
  const idempotencyKey = ctx.request.header['Idempotency-Key'];
  
  if(!idempotencyKey) {
    return await next();
  }

  await checkStore(storeOptions, idempotencyKey, ctx, next);
}

const checkStore = checkStoreRoot(getStoreProvider, createKey);
const idempotence = idempotenceRoot(checkStore);

module.exports = {
  idempotenceRoot,
  checkStoreRoot,
  idempotence,
};
