const {createKey} = require('./lib/utils');
const {getStoreProvider} = require('./lib/storeProviders');

const idempotence = opts => async (ctx, next) => {
  const idempotencyKey = ctx.request.header['Idempotency-Key'];
  
  if(!idempotencyKey) {
    return await next();
  }


}


module.exports = idempotence;
