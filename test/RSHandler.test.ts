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

  describe('getElement(): HTMLElement', () => {
    it('Should retun an HTMLElement', () => {
      expect(h.getElement()).to.have.class('rslider__handler');
    });
  });

  describe('setPosition(coord: number): void', () => {
    it('Should update style attribute', () => {
      const el = h.getElement();

      [10, 22, 36.6].forEach((percent) => {
        h.setPosition(percent);

        expect(el).to.have.attr('style');
        expect(el.style.left).to.equal(`${percent}%`);
      });
    });

    it('Should update style attribute for vertical layout too', () => {
      const el = h.getElement();
      h.toggleLayout('vertical');

      [3.14, 61, 7].forEach((percent) => {
        h.setPosition(percent);

        expect(el).to.have.attr('style');
        expect(el.style.bottom).to.equal(`${percent}%`);
      });
    });
  });

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
