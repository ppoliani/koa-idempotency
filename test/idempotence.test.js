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
  const idempotencyKey = 12345;
  const nextSpy = sinon.spy();
  const ctx = {
    request: {
      path: '/pay',
      body: {prop: 'prop1'},
      header: {
        'Idempotency-Key': idempotencyKey
      }
    },
    response: {
      path: '/pay',
      body: {prop: 'prop2'}
    }
  }

  await idempotence()(ctx, nextSpy);

  t.deepEqual(store.get(createKey(ctx.response.path, ctx.response.body, idempotencyKey)), {});
});
