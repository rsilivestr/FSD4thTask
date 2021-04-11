/* eslint-disable no-undef */
import { expect } from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';

import { View } from '@/components/views';
import * as types from '@/components/types';

chai.use(sinonChai);

describe('View(container: HTMLElement, o: SliderOptions)', () => {
  const CONFIG_KEYS = [
    'isHorizontal',
    'handlerRadius',
    'showProgress',
    'showScale',
    'showTooltip',
  ];

  const MODEL_KEYS = [
    'minValue',
    'maxValue',
    'stepSize',
    'handlerCount',
    'allowReversedValues',
  ];

  const MODEL_DEFAULT_CONFIG: types.TSliderOptions = {
    minValue: 0,
    maxValue: 30,
    stepSize: 3,
    handlerCount: 1,
    allowReversedValues: false,
  };

  const VIEW_DEFAULT_CONFIG = {
    isHorizontal: true,
    handlerRadius: 8,
    showProgress: true,
    showScale: true,
    showTooltip: true,
  };

  const SLIDER_DEFAULTS = { ...MODEL_DEFAULT_CONFIG, ...VIEW_DEFAULT_CONFIG };

  const container = document.createElement('div');
  const VIEW = new View(container, SLIDER_DEFAULTS);

  beforeEach(() => {
    // Re-apply default config
    VIEW.setConfig(VIEW_DEFAULT_CONFIG);
    VIEW.setModelOptions(MODEL_DEFAULT_CONFIG);
    // Make sure that value(s) is(are) set
    VIEW.setValues([0]);
  });

  describe('setValues(values: number[]): void ', () => {});

  describe('getConfig(): TViewOptions', () => {
    it('Should return config object', () => {
      const res = VIEW.getConfig();

      expect(res).to.have.deep.keys(CONFIG_KEYS);
      expect(res).to.eql(VIEW_DEFAULT_CONFIG);
    });
  });

  describe('setConfig(o: TViewOptions): TViewOptions', () => {
    it('Should return TViewOptions object', () => {
      expect(VIEW.setConfig({})).to.have.deep.keys(CONFIG_KEYS);
    });

    it('Should return changed config values', () => {
      const conf = {
        isHorizontal: false,
        handlerRadius: 8,
        showProgress: false,
        showScale: true,
        showTooltip: true,
      };

      expect(VIEW.setConfig(conf)).to.eql(conf);
    });

    it('Should change orientation', () => {
      expect(container.querySelector('.rslider')).to.have.class(
        'rslider--layout_horizontal'
      );
      expect(container.querySelector('.rslider')).to.not.have.class(
        'rslider--layout_vertical'
      );

      VIEW.setConfig({ isHorizontal: false });

      expect(container.querySelector('.rslider')).to.have.class(
        'rslider--layout_vertical'
      );
      expect(container.querySelector('.rslider')).to.not.have.class(
        'rslider--layout_horizontal'
      );
    });

    it('Should toggle progress OFF', () => {
      VIEW.setConfig({ showProgress: false });

      expect(container).to.not.contain('.rslider__progress');
    });

    it('Should toggle progress ON', () => {
      VIEW.setConfig({ showProgress: true });

      expect(container).to.contain('.rslider__progress');
    });

    it('Should toggle scale OFF', () => {
      VIEW.setConfig({ showScale: false });
      expect(container).to.not.contain('.rslider__scale');
    });

    it('Should toggle scale ON', () => {
      VIEW.setConfig({ showScale: true });
      expect(container).to.contain('.rslider__scale');
    });

    it('Should toggle tooltip OFF', () => {
      VIEW.setConfig({ showTooltip: false });
      expect(container).to.not.contain('.rslider__tooltip');
    });

    it('Should toggle tooltip ON', () => {
      VIEW.setConfig({ showTooltip: true });

      expect(container).to.contain('.rslider__tooltip');
    });
  });

  describe('setModelOptions(o: ModelOptions): ModelOptions', () => {
    it('Should return ModelOptions object', () => {
      const conf = {
        minValue: 10,
        maxValue: 30,
        stepSize: 5,
        handlerCount: 2,
        allowReversedValue: false,
      };

      const res = VIEW.setModelOptions(conf);

      // Should update values when handlerCount changes
      VIEW.setValues([10, 25]);

      expect(res).to.have.deep.keys(MODEL_KEYS);
    });
  });

  describe('onScaleClick(value: number): void', () => {
    let spy: sinon.SinonSpy<any, void>;

    beforeEach(() => {
      spy = sinon.spy(VIEW, 'notifyObservers');
    });

    afterEach(() => {
      spy.restore();
    });

    it('Should call notifyObservers', () => {
      VIEW.onScaleClick(9);
      sinon.assert.calledOnce(spy);
    });

    it('Should call notifyObservers with params', () => {
      VIEW.onScaleClick(9);
      spy.should.have.been.calledOnceWith(0, 9);
    });
  });

  // describe('onTrackMousedown(e: MouseEvent): void', () => {});
});
