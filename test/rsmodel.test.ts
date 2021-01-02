import { expect } from 'chai';
import RSModel from '../src/scripts/_model';

const m = new RSModel();

describe('RSModel', () => {
  describe('public config', () => {
    it('Should return an object', () => {
      expect(m.config()).to.be.an('object');
    });

    it('Should have properties', () => {
      expect(m.config()).to.have.deep.keys([
        'handlerCount',
        'maxValue',
        'minValue',
        'stepSize',
      ]);
    });
  });
});

// describe('', () => {})
// it('', () => {});
