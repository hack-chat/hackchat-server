import { expect } from 'chai';
import CoreApp from '../src/serverLib/CoreApp.js';

const expectThrowsAsync = async (method, errorMessage) => {
  let error = null;
  try {
    await method();
  }
  catch (err) {
    error = err;
  }

  expect(error).to.be.an('Error');

  if (errorMessage) {
    expect(error.message).to.include(errorMessage);
  }
}

describe('Checking Core App', () => {
  it('should be constructed', () => {
    expect(new CoreApp()).to.be.an.instanceof(CoreApp);
  });

  it('should throw an error on an unknown language', async () => {
    const coreApp = new CoreApp({
      configPath: '.hcserverAlt.json',
      logErrDetailed: true,
      lang: 'lmao',
    });

    await expectThrowsAsync(() => coreApp.loadLanguage(), 'Cannot find translation file:');
  });

  it('should throw an error on failing to load lang json', async () => {
    const coreApp = new CoreApp({
      configPath: '.hcserverAlt.json',
      logErrDetailed: true,
      lang: 'bad',
    });

    await expectThrowsAsync(() => coreApp.loadLanguage(), 'Error loading translation file:');
  });

  it('should throw an error on failing to find the config file', async () => {
    const coreApp = new CoreApp({
      configPath: '.missing.json',
      logErrDetailed: true,
      lang: 'en',
    });

    coreApp.i18n = await coreApp.loadLanguage();

    await expectThrowsAsync(() => coreApp.loadConfig(), 'Missing config file');
  });

  it('should throw an error on failing to load the config file', async () => {
    const coreApp = new CoreApp({
      configPath: 'test/badConfig.json',
      logErrDetailed: true,
      lang: 'en',
    });

    coreApp.i18n = await coreApp.loadLanguage();

    await expectThrowsAsync(() => coreApp.loadConfig(), 'Failed to load .hcserver.json');
  });

  it('should initialize', () => {
    const coreApp = new CoreApp({
      configPath: '.hcserverAlt.json',
      logErrDetailed: true,
      lang: 'en',
    });

    coreApp.init();

    expect(new CoreApp()).to.be.an.instanceof(CoreApp);
  });
});
