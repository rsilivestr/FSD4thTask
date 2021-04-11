/* eslint-disable no-undef */
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { Scale } from '@/components/views';

chai.use(sinonChai);

describe('Scale(container: HTMLElement, o: SliderOptions)', () => {
  const SLIDER = document.createElement('div');
  const DEFAULT_CONFIG = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    isHorizontal: true,
  };

  const SCALE = new Scale(SLIDER, DEFAULT_CONFIG);
  const ELEMENT = SCALE.getElement();

  beforeEach(() => {
    // Make sure scale has defalut config
    SCALE.setConfig(DEFAULT_CONFIG);
  });

  describe('getElement(): HTMLUListElement', () => {
    it('Should return an unordered list element', () => {
      expect(SCALE.getElement()).to.match('ul.rscale');
    });

    it('Should contain marks - li elements', () => {
      expect(SCALE.getElement()).to.contain('li.rscale__mark');
    });
  });

  describe('public toggleLayout(layout: "horizontal" | "vertical"): void', () => {
    it('Should add vertical layout modifier to rscale when layout is set to vertical', () => {
      SCALE.toggleLayout('vertical');

      expect(ELEMENT).to.have.class('rscale--layout_vertical');
    });

    it('Should remove horizontal layout modifier from rscale when layout is set to vertical', () => {
      SCALE.toggleLayout('vertical');

      expect(ELEMENT).to.not.have.class('rscale--layout_horizontal');
    });

    it('Should add horizontal layout modifier from rscale when layout is set to horizontal', () => {
      SCALE.toggleLayout('horizontal');

      expect(ELEMENT).to.have.class('rscale--layout_horizontal');
    });

    it('Should remove vertical layout modifier from rscale when layout is set to horizontal', () => {
      SCALE.toggleLayout('horizontal');

      expect(ELEMENT).to.not.have.class('rscale--layout_vertical');
    });
  });

  describe('public setConfig(o: ModelOptions): void', () => {
    it('Should update number of scale marks on config change', () => {
      SCALE.setConfig({ stepSize: 20 });

      // minValue is 0, maxValue is 100
      // (100 - 0) / 20 + 1 = 6 scale marks should be rendered
      expect(ELEMENT.childNodes.length).to.equal(6);
    });

    it('Should not exceed maximum of 11 steps', () => {
      SCALE.setConfig({ stepSize: 1 });

      expect(ELEMENT.childNodes.length).to.equal(11);
    });

    it('Should update number of marks and their values on config change', () => {
      SCALE.setConfig({
        minValue: -10,
        maxValue: 40,
        stepSize: 10,
      });

      const marks = ELEMENT.querySelectorAll('.rscale__mark');
      const expectedMarkValues = ['-10', '0', '10', '20', '30', '40'];

      marks.forEach((mark, index) => {
        expect(mark).to.have.text(expectedMarkValues[index]);
      });
    });
  });

  describe('Scale click event', () => {
    it('Should call SCALE.notifyObservers method with value of clicked element text', () => {
      const spy = sinon.spy(SCALE, 'notifyObservers');
      const click = new MouseEvent('click', { bubbles: true });
      const markElements = ELEMENT.querySelectorAll('.rscale__mark');

      markElements.forEach((mark) => {
        const value = parseInt(mark.textContent, 10);

        mark.dispatchEvent(click);

        spy.should.have.been.calledWith(value);
      });

      spy.restore();
    });
  });
});
