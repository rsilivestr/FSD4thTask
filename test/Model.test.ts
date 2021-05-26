/* eslint-disable no-undef */
import { expect } from 'chai';

import Model from '@/components/Model';
import * as types from '@/components/types';

describe('Model', () => {
  const DEFAULT_CONFIG: types.TModelOptions = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    handlerCount: 1,
    allowReversedValues: false,
    handlerInteraction: 'move',
  };

  const CONFIG_KEYS = Object.keys(DEFAULT_CONFIG);

  const MODEL = new Model();

  beforeEach(() => {
    MODEL.setConfig(DEFAULT_CONFIG);
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
    it('Should work with sole minValue option provided', () => {
      MODEL.setConfig({ minValue: 20 });
      expect(MODEL.getConfig().minValue).to.equal(20);
    });

    it('Should work with sole maxValue option provided', () => {
      MODEL.setConfig({ maxValue: 120 });
      expect(MODEL.getConfig().maxValue).to.equal(120);
    });

    it('Should work with sole stepSize option provided', () => {
      MODEL.setConfig({ stepSize: 20 });
      expect(MODEL.getConfig().stepSize).to.equal(20);
    });

    it('Should work with sole handlerCount option provided', () => {
      MODEL.setConfig({ handlerCount: 2 });
      expect(MODEL.getConfig().handlerCount).to.equal(2);
    });

    it('Should not work with 2 options provided', () => {
      MODEL.setConfig({ minValue: 20, maxValue: 120 });
      expect(MODEL.getConfig()).to.eql(DEFAULT_CONFIG);

      MODEL.setConfig({ minValue: 20, stepSize: 20 });
      expect(MODEL.getConfig()).to.eql(DEFAULT_CONFIG);

      MODEL.setConfig({ minValue: 20, handlerCount: 3 });
      expect(MODEL.getConfig()).to.eql(DEFAULT_CONFIG);
    });

    it('Should not work with 3 options provided', () => {
      MODEL.setConfig({
        minValue: 20,
        maxValue: 120,
        stepSize: 5,
      });
      expect(MODEL.getConfig()).to.eql(DEFAULT_CONFIG);

      MODEL.setConfig({
        minValue: 20,
        maxValue: 120,
        handlerCount: 4,
      });
      expect(MODEL.getConfig()).to.eql(DEFAULT_CONFIG);
    });

    it('Should work with all four options provided', () => {
      const conf = {
        minValue: 5,
        maxValue: 25,
        stepSize: 5,
        handlerCount: 2,
      };
      const { allowReversedValues, handlerInteraction } = MODEL.getConfig();

      MODEL.setConfig(conf);

      expect(MODEL.getConfig()).to.eql({
        ...conf,
        allowReversedValues,
        handlerInteraction,
      });
    });

    it('Should not be able to set minValue = maxValue and vice versa', () => {
      const { minValue, maxValue } = MODEL.getConfig();

      MODEL.setConfig({ maxValue: minValue });
      expect(MODEL.getConfig().maxValue).to.not.equal(minValue);

      MODEL.setConfig({ minValue: maxValue });
      expect(MODEL.getConfig().minValue).to.not.equal(maxValue);
    });

    it('Should not be able to set minValue < maxValue if allowReversedValues is OFF', () => {
      MODEL.setConfig({ allowReversedValues: false, maxValue: -100 });
      expect(MODEL.getConfig().maxValue).to.equal(100);
    });

    it('Should be able to set minValue < maxValue if allowReversedValues is ON', () => {
      MODEL.setConfig({ allowReversedValues: true, maxValue: -100 });
      expect(MODEL.getConfig().maxValue).to.equal(-100);
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
    it('Shuold set value = minValue if provided value < minValue', () => {
      const { minValue } = MODEL.getConfig();

      MODEL.setValue(0, -999);
      expect(MODEL.getValue(0)).to.equal(minValue);
    });

    it('Should set value = maxValue if provided value > maxValue', () => {
      const { maxValue } = MODEL.getConfig();

      MODEL.setValue(0, 9001);
      expect(MODEL.getValue(0)).to.equal(maxValue);
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
});
