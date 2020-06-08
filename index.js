const {createKey} = require('./lib/utils');
const {getStoreProvider} = require('./lib/storeProviders');

const storeResponse = (idempotencyKey, store, ctx) => {
  const {path} = ctx.request;
  const {status, body, headers} = ctx.response;
  const response = {status, body, headers};

  store.set(createKey(path, body, idempotencyKey));
}

const checkStore = async (storeOptions, idempotencyKey, ctx, next) => {
  const {path, body: reqBody} = ctx.request;
  const store = getStoreProvider(storeOptions);
  const cachedResponse = store.get(createKey(path, reqBody, idempotencyKey));

  if(!cachedResponse) {
    await next();
    storeResponse(idempotencyKey, store, ctx);
  }

  const {statusCode, body: resBody, headers} = cachedResponse;
  ctx.status = statusCode;
  ctx.body = resBody;
  res.set(headers);
  res.set('X-Cache', 'HIT');
}

const idempotence = (opts={}) => async (ctx, next) => {
  const {storeOptions} = opts;
  const idempotencyKey = ctx.request.header['Idempotency-Key'];
  
  if(!idempotencyKey) {
    return await next();
  }

  await checkStore(storeOptions, idempotencyKey, ctx);


}


module.exports = idempotence;
