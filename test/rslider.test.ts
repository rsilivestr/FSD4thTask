import { expect } from 'chai';
import SliderOptions from '../src/scripts/interface/SliderOptions';

import { create } from '../src/scripts/rslider';
import RScale from '../src/scripts/scale';

const container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);

const slider = create('#root');

describe('RSlider', () => {
  const SLIDER_OPTIONS_KEYS = [
    'minValue',
    'maxValue',
    'stepSize',
    'handlerCount',
    'isHorizontal',
    'handlerRadius',
    'tooltip',
    'progress',
  ];

  const DEFAULT_CONFIG = {
    minValue: -50,
    maxValue: 50,
    stepSize: 5,
    handlerCount: 2,
    tooltip: true,
    progress: false,
  };

  const DEFAULT_VALUES = [10, 40];

  beforeEach(() => {
    slider.setConfig(DEFAULT_CONFIG);

    slider.setValues(DEFAULT_VALUES);
  });

  describe('getConfig(): SliderOptions', () => {
    it('Should be a function', () => {
      expect(slider.getConfig).to.be.a('function');
    });

    it('Should return SliderOptions object', () => {
      expect(slider.getConfig()).to.have.deep.keys(SLIDER_OPTIONS_KEYS);
    });
  });

  describe('setConfig(o?: SliderOptions): SliderOptions', () => {
    it('Should be a function', () => {
      expect(slider.setConfig).to.be.a('function');
    });

    it('Should return SliderOptions object', () => {
      expect(slider.setConfig({ minValue: 0 })).to.have.deep.keys(SLIDER_OPTIONS_KEYS);
    });

    it('Should set properties', () => {
      const o: SliderOptions = { stepSize: 4 };

      expect(slider.setConfig(o).stepSize).to.equal(4);
    });
  });

  describe('getValue(index: number): number', () => {
    it('Should return a number', () => {
      expect(slider.getValue(0)).to.be.a('number');
    });
  });

  describe('setValue(index: number, value: number): number', () => {
    it('Should', () => {
      expect(slider.setValue(0, 20)).to.equal(20);
    });
  });

  describe('values(v?: number[]): number[]', () => {
    it('Should return a number array', () => {
      expect(slider.getValues()).to.be.an('array');
      expect(slider.getValues()[0]).to.be.a('number');
    });
  });

  describe('setValues(v: number[]): number[]', () => {
    it('Should return an array', () => {
      expect(slider.getValues()).to.be.an('array');
    });

    // it('Should set values', () => {
    // expect(slider.setValues([30])).to.eql([30]);
    // });
    // TODO RSlider "before each" hook for "Should return scale object" FAILED
    // TypeError: Cannot read property 'toString' of undefined at RSHandler._updateTooltip
  });

  describe('addScale(): Scale', () => {
    it('Should return scale object', () => {
      expect(slider.addScale()).to.be.an.instanceOf(RScale);
    });
  });
});
