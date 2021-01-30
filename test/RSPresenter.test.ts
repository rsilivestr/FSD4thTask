/* eslint-disable no-undef */
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import Model from '../src/components/RSModel';
import View from '../src/components/RSView';
import Presenter from '../src/components/RSPresenter';

chai.use(sinonChai);

const CONTAINER = document.createElement('div');

const MODEL = new Model();
const VIEW = new View(CONTAINER);
const PRESENTER = new Presenter(MODEL, VIEW);

describe('RSPresenter', () => {
  describe('getValues(): number[]', () => {
    const { handlerCount } = MODEL.getConfig();
    const result = PRESENTER.getValues();

    it('Should be an array', () => {
      expect(result).to.be.an('array');
    });

    it('Should be of a certain length', () => {
      expect(result.length).to.equal(handlerCount);
    });
  });

  describe('setModelValue(index: number, value: number): number', () => {
    it('Should return a number', () => {
      expect(PRESENTER.setModelValue(0, 40)).to.be.a('number');
    });

    it('Should return a multiple of stepSize', () => {
      expect(PRESENTER.setModelValue(0, 43)).to.equal(40);
    });
  });

  describe('update(v: number[]): void', () => {
    it('Should call MODEL.getConfig without argumens', () => {
      const spy = sinon.spy(MODEL, 'getConfig');

      PRESENTER.update([5]);

      spy.should.have.been.calledOnceWith();

      spy.restore();
    });

    it('Should call VIEW.setModelConfig with model config', () => {
      const spy = sinon.spy(VIEW, 'setModelOptions');
      const config = MODEL.getConfig();

      PRESENTER.update([5]);

      spy.should.have.been.calledOnceWith(config);

      spy.restore();
    });

    it('Should call VIEW.setValues() with provided values', () => {
      const spy = sinon.spy(VIEW, 'setValues');
      const values = [10];

      PRESENTER.update(values);

      spy.should.have.been.calledOnceWith(values);

      spy.restore();
    });
  });
});
