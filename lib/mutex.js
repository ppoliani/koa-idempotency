const {Mutex} = require('await-semaphore');

const locks = {};

const lookupMutex = lockId => {
  let mutex = locks[lockId];

  if(!mutex) {
    mutex = new Mutex();
    locks[lockId] = mutex;
  }

  return mutex;
};

const getLock = async lockId => {
  const mutex = lookupMutex(lockId);
  const releaseLock = await mutex.acquire();

  return releaseLock;
};

module.exports = {getLock}
