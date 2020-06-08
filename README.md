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
app.use(idempotency());
```

Roadmap
===

- Allow additional storage providers. At the moment we support the in-memory provider to store the cached responses

License
===
MIT License
