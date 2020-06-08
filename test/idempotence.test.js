const test = require('ava');
const sinon = require('sinon');
const {getStoreProvider} = require('../lib/storeProviders');
const {createKey} = require('../lib/utils');
const {idempotence} = require('..');

test('it should move to the next middleware if no Idempotency-Key exist', async t => {
  const nextSpy = sinon.spy();
  const ctx = {
    request: {header: {}}
  }

  await idempotence()(ctx, nextSpy);

  t.true(nextSpy.calledOnce);
});

test('it should execute the request and store the response if there is no response for the given Idempotency-Key stored in the store', async t => {
  const store = getStoreProvider();
  const idempotencyKey = '12345';
  const nextSpy = sinon.spy();
  const response =  {
    headers: {headerKey: 'headerVal'},
    status: 201,
    body: {prop: 'prop2'}
  }

  const ctx = {
    request: {
      path: '/pay',
      body: {prop: 'prop1'},
      header: {
        'Idempotency-Key': idempotencyKey
      }
    },
    response
  }

  await idempotence()(ctx, nextSpy);

  t.deepEqual(store.get(createKey(ctx.request.path, ctx.response.body, idempotencyKey)), response);
});

test('it should return the cached version corresponding to the given Idempotency-Key', async t => {
  const idempotencyKey = '12345';
  const nextSpy = sinon.spy();
  const response =  {
    headers: {headerKey: 'headerVal'},
    status: 201,
    body: {prop: 'prop2'}
  }

  const ctx = {
    set: (key, val) => function() {
      if(typeof key === 'object') {
        this.response.header = val;
      }
      else {
        this.response.header[key] = val;
      }
    },
    request: {
      path: '/pay',
      body: {prop: 'prop1'},
      header: {
        'Idempotency-Key': idempotencyKey
      }
    },
    response
  }

  await idempotence()(ctx, nextSpy);
  await idempotence()(ctx, nextSpy);

  t.deepEqual(ctx.status, response.status);
  t.deepEqual(ctx.response.header, {...response.headers, 'X-Cache': 'HIT'});
  t.deepEqual(ctx.body, response.body);
});
