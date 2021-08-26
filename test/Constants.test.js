import { expect } from 'chai';
import { CoreOptions, DefaultConfig } from '../src/utility/Constants.js';

describe('Checking Constants', () => {
  it('should have a configPath', () => {
    expect(CoreOptions.configPath).to.be.a('string');
  });

  it('should have a logErrDetailed', () => {
    expect(CoreOptions.logErrDetailed).to.be.a('boolean');
  });

  it('should have a lang', () => {
    expect(CoreOptions.lang).to.be.a('string');
  });

  it('should have a default modulesPath', () => {
    expect(DefaultConfig.modulesPath).to.be.a('string');
  });

  it('should have a default websocketPort', () => {
    expect(DefaultConfig.websocketPort).to.be.a('number');
  });

  it('should have a default rateLimit halflife', () => {
    expect(DefaultConfig.rateLimit.halflife).to.be.a('number');
  });

  it('should have a default rateLimit threshold', () => {
    expect(DefaultConfig.rateLimit.threshold).to.be.a('number');
  });

  it('should have a default pulseSpeed', () => {
    expect(DefaultConfig.pulseSpeed).to.be.a('number');
  });
});
