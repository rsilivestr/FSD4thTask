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

  describe('value(index: number, value?: number): number', () => {
    it('Should return a number', () => {
      expect(slider.value(0)).to.be.a('number');
      expect(slider.value(0)).to.equal(0);
    });

    it('Should set a value', () => {
      expect(slider.value(0, 20)).to.equal(20);
    });
  });

  describe('values(v?: number[]): number[]', () => {
    it('Should return a number array', () => {
      expect(slider.values()).to.be.an('array');
    });

    it('Should set values', () => {
      expect(slider.values([30])).to.eql([30]);
    });
  });

  describe('addScale(): Scale', () => {
    it('Should return scale object', () => {
      expect(slider.addScale()).to.be.an.instanceOf(RScale);
    });
  });
});
