const crypto = require('crypto')

const sha256 = payload => crypto.createHash('sha256')
  .update(payload)
  .digest('hex');

  const utf8ToBuffer = str => new Buffer.from(str, 'utf8');

const createKey = (path, body, idempotencyKey) => 
  sha256(Buffer.concat([
    utf8ToBuffer(path),
    utf8ToBuffer(JSON.stringify(body)),
    utf8ToBuffer(idempotencyKey),
  ]))

  module.exports = {createKey}
