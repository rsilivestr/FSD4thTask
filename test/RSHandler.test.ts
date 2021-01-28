/* eslint-disable no-undef */
import { use, expect } from 'chai';
import { Handler, HandlerOptions } from '../src/components/interfaces';
import RSHandler from '../src/components/RSHandler';

use(require('chai-dom'));

describe('RSHandler', () => {
  const o: HandlerOptions = {
    id: 0,
    layout: 'horizontal',
    tooltip: true,
    value: 5,
  };

  const h: Handler = new RSHandler(o);

  const handlerElement = h.getElement();

  beforeEach(() => {
    h.toggleLayout('horizontal');
    h.toggleTooltip(true);
  });

  describe('getElement(): HTMLElement', () => {
    it('Should retun an HTMLElement', () => {
      expect(h.getElement()).to.be.an('HTMLDivElement');
    });

    it('Should retun an element with a certain class', () => {
      expect(h.getElement()).to.have.class('rslider__handler');
    });
  });

  describe('setPosition(coord: number): void', () => {
    const coordValues = [0, 11, 22, 33, 88];

    it('Should update style attribute', () => {
      coordValues.forEach((coord) => {
        h.setPosition(coord);

        expect(handlerElement).to.have.attr('style');
      });
    });

    it('Should set style.left when layout is horizontal', () => {
      coordValues.forEach((coord) => {
        h.setPosition(coord);

        expect(handlerElement.style.left).to.equal(`${coord}%`);
      });
    });

    it('Should set style.bottom when layout is horizontal', () => {
      h.toggleLayout('vertical');

      coordValues.forEach((coord) => {
        h.setPosition(coord);

        expect(handlerElement.style.bottom).to.equal(`${coord}%`);
      });
    });

    it('Should work with float numbers', () => {
      [1.41, 2.72, 3.14159, 88.88].forEach((coord) => {
        h.setPosition(coord);

        expect(handlerElement.style.left).to.equal(`${coord}%`);
      });
    });
  });

  describe('toggleTooltip', () => {
    it('Should accept and return a boolean', () => {
      expect(h.toggleTooltip(true)).to.equal(true);
      expect(h.toggleTooltip(false)).to.equal(false);
    });

    it('Should show tooltip element when true', () => {
      h.toggleTooltip(true);

      expect(h.getElement()).to.have.descendant('.rslider__tooltip');
    });

    it('Should hide tooltip element when false', () => {
      h.toggleTooltip(false);

      expect(h.getElement()).not.to.have.descendant('.rslider__tooltip');
    });

    it('Should set tooltip to opposite if no value provided', () => {
      let oldValue = h.toggleTooltip(true);

      for (let i = 0; i < 7; i += 1) {
        expect(h.toggleTooltip()).to.equal(!oldValue);

        oldValue = h.toggleTooltip();
      }
    });
  });

  describe('toggleLayout', () => {
    it('Should add vertical layout modifier to tooltip when layout is set to vertical', () => {
      h.toggleLayout('vertical');

      expect(handlerElement).to.have.descendant('.rslider__tooltip--vertical');
    });

    it('Should remove horizontal layout modifier from tooltip when layout is set to vertical', () => {
      h.toggleLayout('vertical');

      expect(handlerElement).to.not.have.descendant('.rslider__tooltip--horizontal');
    });

    it('Should add horizontal layout modifier to tooltip when layout is set to horizontal', () => {
      h.toggleLayout('horizontal');

      expect(handlerElement).to.have.descendant('.rslider__tooltip--horizontal');
    });

    it('Should remove vertical layout modifier from tooltip when layout is set to horizontal', () => {
      h.toggleLayout('horizontal');

      expect(handlerElement).to.not.have.descendant('.rslider__tooltip--vertical');
    });
  });
});
