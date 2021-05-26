/* eslint-disable no-undef */
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import Model from '@/components/Model';
import Presenter from '@/components/Presenter';
import { View } from '@/components/views';

chai.use(sinonChai);

const CONTAINER = document.createElement('div');

const MODEL = new Model();
const modelConfig = MODEL.getConfig();
const VIEW = new View(CONTAINER, modelConfig);
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
