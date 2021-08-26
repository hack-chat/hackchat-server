import { CoreApp } from './index.js';

const server = new CoreApp({
  configPath: '.hcserver.json',
  logErrDetailed: true,
  lang: 'en',
});

server.init();
