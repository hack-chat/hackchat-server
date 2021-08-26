/**
  * Default application options
  * @typedef {Object} CoreOptions
  * @property {string} configPath Location of the server config file
  * @property {boolean} logErrDetailed Weight until ratelimited
  * @property {string} lang Target translation file name
  */
export const CoreOptions = {
  configPath: '.hcserver.json',
  logErrDetailed: false,
  lang: 'en',
};

/**
  * Default configuration config options
  * @typedef {Object} DefaultConfig
  * @property {string} modulesPath Location of the server command modules
  * @property {number} websocketPort Weight until ratelimited
  * @property {number} rateLimit.halflife Time in milliseconds to decrement ratelimit weight
  * @property {number} rateLimit.threshold Weight until ratelimited
  */
export const DefaultConfig = {
  modulesPath: './commands',

  websocketPort: 6060,

  rateLimit: {
    halflife: 30 * 1000,
    threshold: 25,
  },

  pulseSpeed: 16 * 1000,
};
