/* eslint-disable no-undef */
import { expect } from 'chai';
import { create } from '../src/components/RSlider';

describe('RSlider', () => {
  const CONTAINER = document.createElement('div');

  const DEFAULT_CONFIG = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    handlerCount: 1,
    allowReversedValues: false,
    isHorizontal: true,
    handlerRadius: 8,
    showProgress: true,
    showScale: true,
    showTooltip: true,
  };

  const CONFIG_KEYS = Object.keys(DEFAULT_CONFIG);

  const SLIDER = create(CONTAINER, DEFAULT_CONFIG);

  beforeEach(() => {
    SLIDER.setConfig(DEFAULT_CONFIG);
  });

  describe('getConfig(): SliderOptions', () => {
    it('Should be a function', () => {
      expect(SLIDER.getConfig).to.be.a('function');
    });

    it('Should return SliderOptions object', () => {
      expect(SLIDER.getConfig()).to.have.deep.keys(CONFIG_KEYS);
    });
  });

  describe('setConfig(o?: SliderOptions): SliderOptions', () => {
    it('Should be a function', () => {
      expect(SLIDER.setConfig).to.be.a('function');
    });

    it('Should return SliderOptions object', () => {
      expect(SLIDER.setConfig({ minValue: 0 })).to.have.deep.keys(CONFIG_KEYS);
    });
  });

  describe('getValue(index: number): number', () => {
    it('Should return a number', () => {
      expect(SLIDER.getValue(0)).to.be.a('number');
    });
  });

  describe('setValue(index: number, value: number): number', () => {
    it('Should return set value', () => {
      expect(SLIDER.setValue(0, 20)).to.equal(20);
    });

    it('Should set and return minValue if new value is less than minValue', () => {
      const { minValue } = DEFAULT_CONFIG;
      const value = minValue - 999;

      expect(SLIDER.setValue(0, value)).to.equal(minValue);
    });

    it('Should set and return maxValue if new value is greater than maxValue', () => {
      const { maxValue } = DEFAULT_CONFIG;
      const value = maxValue + 999;

      expect(SLIDER.setValue(0, value)).to.equal(maxValue);
    });
  });

  describe('getValues(): number[]', () => {
    it('Should return an array', () => {
      expect(SLIDER.getValues()).to.be.an('array');
    });

    it('Should return a number array', () => {
      SLIDER.getValues().forEach((value) => {
        expect(value).to.be.a('number');
      });
    });
  });

  describe('setValues(v: number[]): number[]', () => {
    it('Should return an array', () => {
      expect(SLIDER.getValues()).to.be.an('array');
    });

    it('Should set provided values', () => {
      const valuesArray = [30];
      SLIDER.setValues(valuesArray);

      expect(SLIDER.getValues()).to.eql(valuesArray);
    });
  });
});
