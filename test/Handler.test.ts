/* eslint-disable no-undef */
import { use, expect } from 'chai';

import Handler from '../src/components/Handler';
import * as types from '../src/components/types';

use(require('chai-dom'));

describe('Handler', () => {
  const CONFIG: types.THandlerOptions = {
    id: 0,
    layout: 'horizontal',
    tooltip: true,
    value: 5,
  };

  const HANDLER: types.THandler = new Handler(CONFIG);

  const HANDLER_ELEMENT = HANDLER.getElement();

  beforeEach(() => {
    HANDLER.toggleLayout('horizontal');
    HANDLER.toggleTooltip(true);
  });

  describe('getElement(): HTMLElement', () => {
    it('Should retun an HTMLElement', () => {
      expect(HANDLER.getElement()).to.be.an('HTMLDivElement');
    });

    it('Should retun an element with a certain class', () => {
      expect(HANDLER.getElement()).to.have.class('rslider__handler');
    });
  });

  describe('setPosition(coord: number): void', () => {
    const coordValues = [0, 11, 22, 33, 88];

    it('Should update style attribute', () => {
      coordValues.forEach((coord) => {
        HANDLER.setPosition(coord);

        expect(HANDLER_ELEMENT).to.have.attr('style');
      });
    });

    it('Should set style.left when layout is horizontal', () => {
      coordValues.forEach((coord) => {
        HANDLER.setPosition(coord);

        expect(HANDLER_ELEMENT.style.left).to.equal(`${coord}%`);
      });
    });

    it('Should set style.bottom when layout is horizontal', () => {
      HANDLER.toggleLayout('vertical');

      coordValues.forEach((coord) => {
        HANDLER.setPosition(coord);

        expect(HANDLER_ELEMENT.style.bottom).to.equal(`${coord}%`);
      });
    });

    it('Should work with float numbers', () => {
      [1.41, 2.72, 3.14159, 88.88].forEach((coord) => {
        HANDLER.setPosition(coord);

        expect(HANDLER_ELEMENT.style.left).to.equal(`${coord}%`);
      });
    });
  });

  describe('toggleTooltip', () => {
    it('Should accept and return a boolean', () => {
      expect(HANDLER.toggleTooltip(true)).to.equal(true);
      expect(HANDLER.toggleTooltip(false)).to.equal(false);
    });

    it('Should show tooltip element when true', () => {
      HANDLER.toggleTooltip(true);

      expect(HANDLER.getElement()).to.have.descendant('.rslider__tooltip');
    });

    it('Should hide tooltip element when false', () => {
      HANDLER.toggleTooltip(false);

      expect(HANDLER.getElement()).not.to.have.descendant('.rslider__tooltip');
    });

    it('Should set tooltip to opposite if no value provided', () => {
      let oldValue = HANDLER.toggleTooltip(true);

      for (let i = 0; i < 7; i += 1) {
        expect(HANDLER.toggleTooltip()).to.equal(!oldValue);

        oldValue = HANDLER.toggleTooltip();
      }
    });
  });

  describe('toggleLayout', () => {
    it('Should add vertical layout modifier to tooltip when layout is set to vertical', () => {
      HANDLER.toggleLayout('vertical');

      expect(HANDLER_ELEMENT).to.have.descendant('.rslider__tooltip--vertical');
    });

    it('Should remove horizontal layout modifier from tooltip when layout is set to vertical', () => {
      HANDLER.toggleLayout('vertical');

      expect(HANDLER_ELEMENT).to.not.have.descendant('.rslider__tooltip--horizontal');
    });

    it('Should add horizontal layout modifier to tooltip when layout is set to horizontal', () => {
      HANDLER.toggleLayout('horizontal');

      expect(HANDLER_ELEMENT).to.have.descendant('.rslider__tooltip--horizontal');
    });

    it('Should remove vertical layout modifier from tooltip when layout is set to horizontal', () => {
      HANDLER.toggleLayout('horizontal');

      expect(HANDLER_ELEMENT).to.not.have.descendant('.rslider__tooltip--vertical');
    });
  });
});
