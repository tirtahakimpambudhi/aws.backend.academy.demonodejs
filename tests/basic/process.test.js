import { getUsage } from '../../src/basic/process.js';
import { expect } from 'chai';

describe('Test Get Usage', () => {
  it('Should be Successfully', () => {
    const usage = getUsage();
    expect(Object.keys(usage).length).to.eq(5);
  });
  it('Should be Successfully When Add Unit KB', () => {
    const usage = getUsage();
    for (let key in usage) {
      usage[key].push({ size: usage[key].size * 1024, unit: 'KB' });
    }
  });
});
