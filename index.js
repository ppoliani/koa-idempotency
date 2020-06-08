const {createKey} = require('./lib/utils');
const {getStoreProvider} = require('./lib/storeProviders');

const checkStore = async (storeOptions, idempotencyKey, ctx, next) => {
  const {path, body} = ctx.request;
  const store = getStoreProvider(storeOptions);
  const cachedResponse = store.get(createKey(path, body, idempotencyKey));

  if(!cachedResponse) {
    return await next();
  }

  const {statusCode, body, headers} = cachedResponse;
  ctx.status = statusCode;
  ctx.body = body;
  res.set(headers);
  res.set('X-Cache', 'HIT');
}

const idempotence = opts => async (ctx, next) => {
  const {storeOptions} = opts;
  const idempotencyKey = ctx.request.header['Idempotency-Key'];
  
  if(!idempotencyKey) {
    return await next();
  }

  await checkStore(storeOptions, idempotencyKey, ctx);


}


module.exports = idempotence;
