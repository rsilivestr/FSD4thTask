/* eslint-disable no-undef */
import { expect } from 'chai';
import { create } from '../src/components/RSlider';

describe('RSlider', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const SLIDER = create(container);

  const CONFIG_KEYS = [
    'minValue',
    'maxValue',
    'stepSize',
    'handlerCount',
    'allowReversedValues',
    'isHorizontal',
    'handlerRadius',
    'showProgress',
    'showScale',
    'showTooltip',
  ];

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
    it('Should', () => {
      expect(SLIDER.setValue(0, 20)).to.equal(20);
    });
  });

  describe('getValues(): number[]', () => {
    it('Should return a number array', () => {
      expect(SLIDER.getValues()).to.be.an('array');
      expect(SLIDER.getValues()[0]).to.be.a('number');
    });
  });

  describe('setValues(v: number[]): number[]', () => {
    it('Should return an array', () => {
      expect(SLIDER.getValues()).to.be.an('array');
    });

    it('Should set values', () => {
      expect(SLIDER.setValues([30])).to.eql([30]);
    });
  });
});
