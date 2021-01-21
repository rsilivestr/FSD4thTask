/* eslint-disable no-undef */
import { expect } from 'chai';
import RScale from '../src/Components/RScale';

describe('RScale(container: HTMLElement, o: SliderOptions)', () => {
  const CONTAINER = document.createElement('div');
  const CONFIG = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    // handlerCount: 1,
    isHorizontal: true,
    // showScale: true,
    // showProgress: true,
    // showTooltip: true,
  };

  const SCALE = new RScale(CONTAINER, CONFIG);
  const ELEMENT = SCALE.getElement();

  describe('getElement(): HTMLUListElement', () => {
    it('Should return a list element', () => {
      expect(SCALE.getElement()).to.match('ul.rscale');
    });

    it('Should contain list marks', () => {
      expect(SCALE.getElement()).to.contain('li.rscale__mark');
    });
  });

  describe('public toggleLayout(layout: "horizontal" | "vertical"): void', () => {
    it('Should toggle scale classes', () => {
      SCALE.toggleLayout('vertical');
      expect(ELEMENT).to.have.class('rscale--layout_vertical');
      expect(ELEMENT).to.not.have.class('rscale--layout_horizontal');

      SCALE.toggleLayout('horizontal');
      expect(ELEMENT).to.have.class('rscale--layout_horizontal');
      expect(ELEMENT).to.not.have.class('rscale--layout_vertical');
    });
  });

  describe('public setConfig(o: ModelOptions): void', () => {
    it('Should re-render scale based on options', () => {
      SCALE.setConfig({
        minValue: 10,
        maxValue: 20,
        stepSize: 2,
        isHorizontal: true,
      });

      expect(ELEMENT.childNodes.length).to.equal(6);
      expect(ELEMENT.firstElementChild).to.have.text('10');
      expect(ELEMENT.lastElementChild).to.have.text('20');
    });
  });
});
