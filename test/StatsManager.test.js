import { expect } from 'chai';
import StatsManager from '../src/serverLib/StatsManager.js';

describe('Checking Stats Manager', () => {
  it('should be constructed', () => {
    expect(new StatsManager({})).to.be.an.instanceof(StatsManager);
  });

  it('should set and get values', () => {
    const stats = new StatsManager();
    stats.set('test', 1);

    expect(stats.get('test')).to.equal(1);
  });

  it('should increment a value', () => {
    const stats = new StatsManager();
    stats.set('test', 1);
    stats.increment('test');

    expect(stats.get('test')).to.equal(2);
  });

  it('should increment a value by X', () => {
    const stats = new StatsManager();
    stats.set('test', 1);
    stats.increment('test', 50);

    expect(stats.get('test')).to.equal(51);
  });

  it('should decrement a value', () => {
    const stats = new StatsManager();
    stats.set('test', 2);
    stats.decrement('test');

    expect(stats.get('test')).to.equal(1);
  });

  it('should decrement a value by X', () => {
    const stats = new StatsManager();
    stats.set('test', 51);
    stats.decrement('test', 50);

    expect(stats.get('test')).to.equal(1);
  });

  it('should not error incrementing missing keys', () => {
    const stats = new StatsManager();
    stats.set('test', 1);
    stats.increment();

    expect(stats.get('test')).to.equal(1);
  });

  it('should not error decrementing missing keys', () => {
    const stats = new StatsManager();
    stats.set('test', 1);
    stats.decrement();

    expect(stats.get('test')).to.equal(1);
  });
});
