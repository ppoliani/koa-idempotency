const test = require('ava');
const sinon = require('sinon');
const idempotence = require('..');

test('it should move to the next middleware if no Idempotency-Key exist', async t => {
  const nextSpy = sinon.spy();
  const ctx = {
    request: {header: {}}
  }

  await idempotence()(ctx, nextSpy);

  t.true(nextSpy.calledOnce);
});
