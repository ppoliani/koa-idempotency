const LRU = require('lru-cache');

const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

const defaultOptions = {
  max: 500,
  length: (n, key) =>  n * 2 + key.length,
  maxAge: CACHE_MAX_AGE 
};

let store = null;

const getOptions = opts => ({defaultOptions, ...opts});
const createStore = opts => {
  if(!store) {
    store = new LRU(getOptions(opts));
  }
}

const get = async key => store.get(key);
const set = async (key, value) => store.set(key, value);

module.exports = {
  createStore,
  interface: {get, set}
}
