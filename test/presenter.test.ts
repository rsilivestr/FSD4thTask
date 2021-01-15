import { expect } from 'chai';

import Model from '../src/Components/RSModel';
import View from '../src/Components/RSView';
import Presenter from '../src/Components/RSPresenter';

const container = document.createElement('div');

const m = new Model();
const v = new View(container);
const p = new Presenter(m, v);

describe('RSPresenter', () => {
  describe('getValues(): number[]', () => {
    const { handlerCount } = m.getConfig();
    const result = p.getValues();

    it('Should be an array', () => {
      expect(result).to.be.an('array');
    });

    it('Should be of a certain length', () => {
      expect(result.length).to.equal(handlerCount);
    });
  });

  describe('setModelValue(index: number, value: number): number', () => {
    it('Should return a number', () => {
      expect(p.setModelValue(0, 40)).to.be.a('number');
    });

    it('Should return a multiple of stepSize', () => {
      expect(p.setModelValue(0, 43)).to.equal(40);
    });
  });

  describe('update(v: number[]): void', () => {});
});
