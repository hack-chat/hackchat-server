import { expect } from 'chai';
import RateLimiter from '../src/serverLib/RateLimiter.js';

const rateLimit = {
  halflife: 30000,
  threshold: 25,
}

describe('Checking Rate Limiter', () => {
  it('should be constructed', () => {
    expect(new RateLimiter(rateLimit)).to.be.an.instanceof(RateLimiter);
  });

  it('should return default records', () => {
    const rateLimiter = new RateLimiter(rateLimit);

    expect(rateLimiter.search('test').score).to.equal(0);
  });

  it('should false if frisk threshold not high enough', () => {
    const rateLimiter = new RateLimiter(rateLimit);

    expect(rateLimiter.frisk('test', 0)).to.equal(false);
  });

  it('should false if frisk threshold is high enough', () => {
    const rateLimiter = new RateLimiter(rateLimit);

    expect(rateLimiter.frisk('test', 9999999)).to.equal(true);
  });

  it('should arrest a record', () => {
    const rateLimiter = new RateLimiter(rateLimit);
    rateLimiter.arrest('test', 'test');

    expect(rateLimiter.frisk('test', 0)).to.equal(true);
  });

  it('should pardon a record', () => {
    const rateLimiter = new RateLimiter(rateLimit);
    rateLimiter.arrest('test', 'test');
    rateLimiter.pardon('test');

    expect(rateLimiter.frisk('test', 0)).to.equal(false);
  });

  it('should clear all records', () => {
    const rateLimiter = new RateLimiter(rateLimit);
    rateLimiter.arrest('test', 'test');
    rateLimiter.clear();

    expect(rateLimiter.frisk('test', 0)).to.equal(false);
  });
});
