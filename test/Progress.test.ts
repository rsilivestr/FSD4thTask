/* eslint-disable no-undef */
import { expect } from 'chai';

import Progress from '../src/components/Progress';

describe('Progress(coords: number[], isHorizontal: boolean)', () => {
  const COORDS: [number, number] = [0, 10];
  const PROGRESS = new Progress(COORDS, true);

  describe('getElement', () => {
    it('Should return HTMLElement', () => {
      expect(PROGRESS.getElement()).to.has.class('rslider__progress');
    });

    it('Returned element should have style attribute', () => {
      expect(PROGRESS.getElement()).to.have.attr('style');
    });

    it('Should set style attribute according to coords in constructor', () => {
      const el = PROGRESS.getElement();

      expect(el.style.left).to.equal(`${COORDS[0]}%`);
      expect(el.style.right).to.equal(`${100 - COORDS[1]}%`);
    });
  });

  describe('setCoords(coords: [number, number]): void', () => {
    it("Should change progress' style attribute", () => {
      const el = PROGRESS.getElement();
      const coordPairs = [
        [0, 15],
        [7, 33],
        [11.51, 84.2],
      ];

      coordPairs.forEach((pair) => {
        PROGRESS.setCoords(pair as [number, number]);

        expect(el.style.left).to.equal(`${pair[0]}%`);
        expect(el.style.right).to.equal(`${100 - pair[1]}%`);
      });
    });
  });

  describe('toggleHorizontal(isHorizontal: boolean): void', () => {
    it('Should set new style attribute and unset old one', () => {
      const el = PROGRESS.getElement();
      const re = /^\d+\.?\d+%$/;

      PROGRESS.toggleHorizontal(false);

      expect(el.style.left).to.equal('');
      expect(el.style.right).to.equal('');
      expect(el.style.bottom).to.match(re);
      expect(el.style.top).to.match(re);

      PROGRESS.toggleHorizontal(true);

      expect(el.style.left).to.match(re);
      expect(el.style.right).to.match(re);
      expect(el.style.bottom).to.equal('');
      expect(el.style.top).to.equal('');
    });
  });
});
