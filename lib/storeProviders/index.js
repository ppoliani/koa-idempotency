const {createCache} = require('./memory');

const PROVIDER_TYPES = {
  MEMORY: 'memory'
};

const defaultOpts = {
  provider: PROVIDER_TYPES.MEMORY
}

const getStoreProvider = (storeOptions=defaultOpts) => {
  const {provider} = storeOptions;

  if(typeof provider !== 'string') {
    return provider;
  }
  
  switch(provider) {
    case PROVIDER_TYPES.MEMORY:
      return createCache();
    default:
      throw new Error(`Unknown store provider type ${provider}`)
  }
}

module.exports = {getStoreProvider}
