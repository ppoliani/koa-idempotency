Motivation
===
Read the rational for implementing this package here https://stripe.com/blog/idempotency

Installation
===

`npm install --save koa-idempotency`

Usage
===

```
const {idempotence} = require('koa-idempotency');
app.use(idempotency(opts));
```

Options
===

- `storeOptions` : Allows you to configure the store provider.

  - `maxAge` (Optional): How long should the store keep the cached response for. Has effect only for the default in memory store provider
  - `provider` (Optional): The  actual store provider. By default it will use the in-memory provider


Custom Store Provider
===

You can use own store provider as long as it implements the following interface:

```
interface StoreProvider {
  get: (key: String) => Promise,
  set: (key: String, value: Object) => Promise
}
```

For example, you could write your own Redis store provider like this:

```
const {promisify} = require("util");
const redis = require("redis");
const {idempotence} = require('koa-idempotency');

const client = redis.createClient();
const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);

const RedisStoreProvider = {
  async get(key) {
    return await getAsync(key)
  },

  async get(key, value) {
    return await setAsync(key, value);
  }
}

const opts = {
  storeOptions: {
    provider: RedisStoreProvider
  }
}

app.use(idempotency(opts));
```


License
===
MIT License
