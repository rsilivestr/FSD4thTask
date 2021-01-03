import { expect } from 'chai';
import RSModel from '../src/scripts/model';

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

  describe('getValue', () => {
    it('Should return a number for existing values, otherwise undefined', () => {
      expect(m.getValue(0)).to.be.a('number');
      // Undefined value is undefined
      const { handlerCount } = m.config();
      expect(m.getValue(handlerCount)).to.be.undefined;
    });
  });

  describe('getValues', () => {
    it('Shuold retun a number array', () => {
      const res = m.getValues();
      const { handlerCount } = m.config();
      expect(res).to.be.an('array');
      expect(res.length).to.equal(handlerCount);
    });
  });

  describe('setValue', () => {
    it('Should return a number', () => {
      const res = m.setValue(0, 50);
      expect(res).to.be.a('number');
      expect(res).to.equal(50);
      expect(m.setValue(0, 20)).to.equal(20);
    });
  });

  describe('setValues', () => {
    it('Should return a number array', () => {
      const res = m.setValues([80]);
      expect(res).to.be.an('array');
      expect(res).to.eql([80]);
    });
  });
});
