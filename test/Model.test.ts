/* eslint-disable no-undef */
import { expect } from 'chai';

import Model from '../src/components/Model';
import * as types from '../src/components/types';

describe('Model', () => {
  const CONFIG_DEFAULTS: types.ModelOptions = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    handlerCount: 1,
    allowReversedValues: false,
    handlerInteraction: 'move',
  };

  const CONFIG_KEYS = Object.keys(CONFIG_DEFAULTS);

  const MODEL = new Model();

  beforeEach(() => {
    MODEL.setConfig(CONFIG_DEFAULTS);
  });

  describe('getConfig(): ModelOptions', () => {
    it('Should return an object', () => {
      expect(MODEL.getConfig()).to.be.an('object');
    });

    it('Should have properties', () => {
      expect(MODEL.getConfig()).to.have.deep.keys(CONFIG_KEYS);
    });
  });

  describe('setConfig(config: ModelOptions): ModelOptions', () => {
    it('Should return ModelOptions object', () => {
      expect(MODEL.setConfig({ stepSize: 20 })).to.have.deep.keys(CONFIG_KEYS);
    });

    it('Should work with single option provided', () => {
      expect(MODEL.setConfig({ minValue: 20 }).minValue).to.equal(20);
      expect(MODEL.setConfig({ maxValue: 120 }).maxValue).to.equal(120);
      expect(MODEL.setConfig({ stepSize: 20 }).stepSize).to.equal(20);
      expect(MODEL.setConfig({ handlerCount: 2 }).handlerCount).to.equal(2);
    });

    it('Should not work with 2 or 3 options', () => {
      expect(MODEL.setConfig({ minValue: 20, maxValue: 120 })).to.eql(CONFIG_DEFAULTS);
      expect(MODEL.setConfig({ minValue: 20, stepSize: 20 })).to.eql(CONFIG_DEFAULTS);
      expect(MODEL.setConfig({ minValue: 20, handlerCount: 3 })).to.eql(CONFIG_DEFAULTS);
      expect(
        MODEL.setConfig({
          minValue: 20,
          maxValue: 120,
          stepSize: 5,
        })
      ).to.eql(CONFIG_DEFAULTS);
      expect(
        MODEL.setConfig({
          minValue: 20,
          maxValue: 120,
          handlerCount: 4,
        })
      ).to.eql(CONFIG_DEFAULTS);
    });

    it('Should work with all four options provided', () => {
      const conf = {
        minValue: 5,
        maxValue: 25,
        stepSize: 5,
        handlerCount: 2,
      };
      const { allowReversedValues, handlerInteraction } = MODEL.getConfig();

      expect(MODEL.setConfig(conf)).to.eql({
        ...conf,
        allowReversedValues,
        handlerInteraction,
      });
    });

    it('Should not be able to set minValue = maxValue and vice versa', () => {
      const { minValue, maxValue } = MODEL.getConfig();

      expect(MODEL.setConfig({ maxValue: minValue }).maxValue).to.not.equal(minValue);
      expect(MODEL.setConfig({ minValue: maxValue }).minValue).to.not.equal(maxValue);
    });

    it('Should not be able to set minValue < maxValue if allowReversedValues is OFF', () => {
      expect(MODEL.setConfig({ maxValue: -100 }).maxValue).to.equal(100);
    });

    it('Should be able to set minValue < maxValue if allowReversedValues is ON', () => {
      expect(
        MODEL.setConfig({ allowReversedValues: true, maxValue: -100 }).maxValue
      ).to.equal(-100);
    });
  });

  describe('getValue(index: number): number', () => {
    it('Should return a number for existing values, otherwise undefined', () => {
      expect(MODEL.getValue(0)).to.be.a('number');
      // Undefined value is undefined
      const { handlerCount } = MODEL.getConfig();
      // eslint-disable-next-line no-unused-expressions
      expect(MODEL.getValue(handlerCount)).to.be.undefined;
    });
  });

  describe('getValues(): number[]', () => {
    it('Shuold retun a number array', () => {
      const res = MODEL.getValues();
      const { handlerCount } = MODEL.getConfig();
      expect(res).to.be.an('array');
      expect(res.length).to.equal(handlerCount);
    });
  });

  describe('setValue(index: number, value: number): number', () => {
    it('Should return a number', () => {
      [10, 30, 40, 100].forEach((n) => {
        expect(MODEL.setValue(0, n)).to.equal(n);
      });
    });

    it('Should return a multiple of stepSize', () => {
      const { minValue, stepSize } = MODEL.getConfig(); // 0, 10
      [7, 15, 33, 59].forEach((n) => {
        expect((MODEL.setValue(0, n) - minValue) % stepSize).to.equal(0);
      });
    });

    it('Shuold set value = minValue if provided value < minValue', () => {
      const { minValue } = MODEL.getConfig();

      expect(MODEL.setValue(0, -999)).to.equal(minValue);
    });

    it('Should set value = maxValue if provided value > maxValue', () => {
      const { maxValue } = MODEL.getConfig();

      expect(MODEL.setValue(0, 9001)).to.equal(maxValue);
    });

    it('Should change other values so there is a minimum of 1 stepSize between handlers', () => {
      MODEL.setConfig({ handlerCount: 2 });

      MODEL.setValue(0, 50);
      expect(MODEL.getValues()).to.eql([50, 60]);

      MODEL.setValue(1, 20);
      expect(MODEL.getValues()).to.eql([10, 20]);
    });

    it('Should not accept anything but numbers', () => {
      ['string', null, NaN, true].forEach((nan) => {
        expect(MODEL.setValue.bind(MODEL, 0, nan as number)).to.throw(
          'Value and index should be numeric'
        );
      });
    });

    it('Should throw error if value with such index does not exist', () => {
      [-1, 2, 99].forEach((i) => {
        expect(MODEL.setValue.bind(MODEL, i, 80)).to.throw(
          'There is no value with such index'
        );
      });
    });
  });

  describe('setValues(values: number[]): number[]', () => {
    it('Should return a number array', () => {
      expect(MODEL.setValues([80])).to.eql([80]);
    });
  });
});
