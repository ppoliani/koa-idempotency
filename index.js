const {createKey} = require('./lib/utils');
const {getLock} = require('./lib/mutex');
const {getStoreProvider} = require('./lib/storeProviders');

const HEADER_NAME = 'Idempotency-Key';

const storeResponse = async (idempotencyKey, store, ctx) => {
  const {path, body: reqBody} = ctx.request;
  const {status, body, header} = ctx.response;
  const response = {status, body, header};

  await store.set(createKey(path, reqBody, idempotencyKey), response);
}

const checkStoreRoot = (getStoreProvider, createKey) => async (storeOptions, idempotencyKey, ctx, next) => {
  const {path, body: reqBody} = ctx.request;
  const store = getStoreProvider(storeOptions);
  const cachedResponse = await store.get(createKey(path, reqBody, idempotencyKey));

  if(!cachedResponse) {
    await next();
    return await storeResponse(idempotencyKey, store, ctx);
  }

  const {status, body: resBody, header} = cachedResponse;
  ctx.status = status;
  ctx.body = resBody;
  ctx.set(header);
  ctx.set('X-Cache', 'HIT');
}

const idempotenceRoot = checkStore => (opts={}) => async (ctx, next) => {
  let releaseLock;

  try {
    const {storeOptions} = opts;
    const idempotencyKey = ctx.request.header[HEADER_NAME]
      ? ctx.request.header[HEADER_NAME] 
      : ctx.request.header[HEADER_NAME.toLocaleLowerCase()];
    
    if(!idempotencyKey) {
      return await next();
    }

    releaseLock = await getLock(idempotencyKey);
    await checkStore(storeOptions, idempotencyKey, ctx, next);
  }
  catch(error) {
    throw error;
  }
  finally {
    if(releaseLock) {
      releaseLock();
    }
  }
}

const checkStore = checkStoreRoot(getStoreProvider, createKey);
const idempotence = idempotenceRoot(checkStore);

module.exports = {
  idempotenceRoot,
  checkStoreRoot,
  idempotence,
};
