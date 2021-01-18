/* eslint-disable no-undef */
import { expect } from 'chai';
import RSModel from '../src/Components/RSModel';

const CONFIG_KEYS = ['handlerCount', 'maxValue', 'minValue', 'stepSize'];
const DEFAULT_CONFIG = {
  minValue: 0,
  maxValue: 100,
  stepSize: 10,
  handlerCount: 1,
};

const m = new RSModel();

describe('RSModel', () => {
  beforeEach(() => {
    m.setConfig(DEFAULT_CONFIG);
  });

  describe('getConfig(): ModelOptions', () => {
    it('Should return an object', () => {
      expect(m.getConfig()).to.be.an('object');
    });

    it('Should have properties', () => {
      expect(m.getConfig()).to.have.deep.keys(CONFIG_KEYS);
    });
  });

  describe('setConfig(config: ModelOptions): ModelOptions', () => {
    it('Should return ModelOptions object', () => {
      expect(m.setConfig({ stepSize: 20 })).to.have.deep.keys(CONFIG_KEYS);
    });

    it('Should work with single option provided', () => {
      expect(m.setConfig({ minValue: 20 }).minValue).to.equal(20);
      expect(m.setConfig({ maxValue: 120 }).maxValue).to.equal(120);
      expect(m.setConfig({ stepSize: 20 }).stepSize).to.equal(20);
      expect(m.setConfig({ handlerCount: 2 }).handlerCount).to.equal(2);
    });

    it('Should not work with 2 or 3 options', () => {
      expect(m.setConfig({ minValue: 20, maxValue: 120 })).to.eql(DEFAULT_CONFIG);
      expect(m.setConfig({ minValue: 20, stepSize: 20 })).to.eql(DEFAULT_CONFIG);
      expect(m.setConfig({ minValue: 20, handlerCount: 3 })).to.eql(DEFAULT_CONFIG);
      expect(
        m.setConfig({
          minValue: 20,
          maxValue: 120,
          stepSize: 5,
        })
      ).to.eql(DEFAULT_CONFIG);
      expect(
        m.setConfig({
          minValue: 20,
          maxValue: 120,
          handlerCount: 4,
        })
      ).to.eql(DEFAULT_CONFIG);
    });

    it('Should work with all four options provided', () => {
      const conf = {
        minValue: 5,
        maxValue: 25,
        stepSize: 5,
        handlerCount: 2,
      };

      expect(m.setConfig(conf)).to.eql(conf);
    });

    it('Should be able to set minValue < maxValue', () => {
      expect(m.setConfig({ maxValue: -100 }).maxValue).to.equal(-100);
    });
  });

  describe('getValue(index: number): number', () => {
    it('Should return a number for existing values, otherwise undefined', () => {
      expect(m.getValue(0)).to.be.a('number');
      // Undefined value is undefined
      const { handlerCount } = m.getConfig();
      // eslint-disable-next-line no-unused-expressions
      expect(m.getValue(handlerCount)).to.be.undefined;
    });
  });

  describe('getValues(): number[]', () => {
    it('Shuold retun a number array', () => {
      const res = m.getValues();
      const { handlerCount } = m.getConfig();
      expect(res).to.be.an('array');
      expect(res.length).to.equal(handlerCount);
    });
  });

  describe('setValue(index: number, value: number): number', () => {
    it('Should return a number', () => {
      [10, 30, 40, 100].forEach((n) => {
        expect(m.setValue(0, n)).to.equal(n);
      });
    });

    it('Should return a multiple of stepSize', () => {
      const { minValue, stepSize } = m.getConfig(); // 0, 10
      [7, 15, 33, 59].forEach((n) => {
        expect((m.setValue(0, n) - minValue) % stepSize).to.equal(0);
      });
    });

    it('Shuold set value = minValue if provided value < minValue', () => {
      const { minValue } = m.getConfig();

      expect(m.setValue(0, -999)).to.equal(minValue);
    });

    it('Should set value = maxValue if provided value > maxValue', () => {
      const { maxValue } = m.getConfig();

      expect(m.setValue(0, 9001)).to.equal(maxValue);
    });

    it('Should change other values so there is a minimum of 1 stepSize between handlers', () => {
      m.setConfig({ handlerCount: 2 });

      m.setValue(0, 50);
      expect(m.getValues()).to.eql([50, 60]);

      m.setValue(1, 20);
      expect(m.getValues()).to.eql([10, 20]);
    });

    it('Should not accept anything but numbers', () => {
      ['string', null, NaN, true].forEach((nan) => {
        expect(m.setValue.bind(m, 0, nan as number)).to.throw(
          'Value and index should be numeric'
        );
      });
    });

    it('Should throw error if value with such index does not exist', () => {
      [-1, 2, 99].forEach((i) => {
        expect(m.setValue.bind(m, i, 80)).to.throw('There is no value with such index');
      });
    });
  });

  describe('setValues(values: number[]): number[]', () => {
    it('Should return a number array', () => {
      expect(m.setValues([80])).to.eql([80]);
    });
  });
});
