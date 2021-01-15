import { expect } from 'chai';
import { create } from '../src/Components/RSlider';

describe('RSlider', () => {
  const container = document.createElement('div');
  document.body.appendChild(container);

  const SLIDER = create(container);

  const SLIDER_OPTIONS_KEYS = [
    'minValue',
    'maxValue',
    'stepSize',
    'handlerCount',
    'isHorizontal',
    'handlerRadius',
    'showProgress',
    'showScale',
    'showTooltip',
  ];

  // const DEFAULT_CONFIG = {
  //   minValue: -50,
  //   maxValue: 50,
  //   stepSize: 5,
  //   handlerCount: 2,
  //   tooltip: true,
  //   progress: true,
  // };

  // const DEFAULT_VALUES = [10, 40];

  // beforeEach(() => {
  //   SLIDER.setConfig(DEFAULT_CONFIG);

  //   SLIDER.setValues(DEFAULT_VALUES);
  // });

  describe('getConfig(): SliderOptions', () => {
    it('Should be a function', () => {
      expect(SLIDER.getConfig).to.be.a('function');
    });
    it('Should return SliderOptions object', () => {
      expect(SLIDER.getConfig()).to.have.deep.keys(SLIDER_OPTIONS_KEYS);
    });
  });

  describe('setConfig(o?: SliderOptions): SliderOptions', () => {
    it('Should be a function', () => {
      expect(SLIDER.setConfig).to.be.a('function');
    });

    it('Should return SliderOptions object', () => {
      expect(SLIDER.setConfig({ minValue: 0 })).to.have.deep.keys(SLIDER_OPTIONS_KEYS);
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

    // it('Should set values', () => {
    //   expect(slider.setValues([30])).to.eql([30]);
    // });
    // TODO RSlider "before each" hook for "Should return scale object" FAILED
    // TypeError: Cannot read property 'toString' of undefined at RSHandler._updateTooltip
  });
});
