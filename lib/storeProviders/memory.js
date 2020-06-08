const LRU = require('lru-cache');

const CACHE_MAX_AGE = 24 * 60 * 60 * 1000; // 24 hours

const defaultOptions = {
  max: 500,
  length: (n, key) =>  n * 2 + key.length,
  maxAge: CACHE_MAX_AGE 
};

const getOptions = opts => ({defaultOptions, ...opts});
const createCache = opts => LRU(getOptions(opts));

module.exports = {createCache}
