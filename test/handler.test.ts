/* eslint-disable no-undef */
import { use, expect } from 'chai';
import { Handler, HandlerOptions } from '../src/Components/interfaces';
import RSHandler from '../src/Components/RSHandler';

use(require('chai-dom'));

describe('RSHandler', () => {
  const o: HandlerOptions = {
    id: 0,
    layout: 'horizontal',
    tooltip: true,
    value: 5,
  };

  const h: Handler = new RSHandler(o);

  describe('getElement(): HTMLElement', () => {
    it('Should retun an HTMLElement', () => {
      expect(h.getElement()).to.have.class('rslider__handler');
    });
  });

  // describe('setPosition(coord: number): void', () => {});

  describe('toggleTooltip', () => {
    it('Should turn tooltip on', () => {
      expect(h.toggleTooltip(true)).to.equal(true);
      expect(h.getElement()).to.have.descendant('.rslider__tooltip');
    });

    it('Should hide tooltip as well', () => {
      expect(h.toggleTooltip(false)).to.equal(false);
      expect(h.getElement()).not.to.have.descendant('.rslider__tooltip');
    });

    it('Should toggle tooltip if no value provided', () => {
      h.toggleTooltip(true);

      expect(h.toggleTooltip()).to.equal(false);
      expect(h.toggleTooltip()).to.equal(true);
    });
  });

  describe('toggleLayout', () => {
    it('Should change tooltip classes', () => {
      const el = h.getElement();

      ['horizontal', 'vertical'].forEach((layout) => {
        h.toggleLayout(layout as 'horizontal' | 'vertical');
        expect(el).to.have.descendant(`.rslider__tooltip--${layout}`);
      });
    });
  });

  describe('updateValue(value: number): void', () => {});
});
