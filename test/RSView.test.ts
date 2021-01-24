/* eslint-disable no-undef */
import { expect } from 'chai';
import RSView from '../src/components/RSView';

describe('RSView(container: HTMLElement, o: SliderOptions)', () => {
  const container = document.createElement('div');
  const VIEW = new RSView(container);

  const CONFIG_DEFAULTS = {
    isHorizontal: true,
    handlerRadius: 8,
    showProgress: true,
    showScale: true,
    showTooltip: true,
  };

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

  beforeEach(() => {
    VIEW.setConfig(CONFIG_DEFAULTS);
  });

  describe('setValues(values: number[]): void ', () => {});

  describe('getConfig(): ViewOptions', () => {
    it('Should return config object', () => {
      const res = VIEW.getConfig();

      expect(res).to.have.deep.keys(CONFIG_KEYS);
      expect(res).to.eql(CONFIG_DEFAULTS);
    });
  });

  describe('setConfig(o: ViewOptions): ViewOptions', () => {
    it('Should return ViewOptions object', () => {
      expect(VIEW.setConfig({})).to.have.deep.keys(CONFIG_KEYS);
    });

    it('Should return changed config values', () => {
      const conf = {
        isHorizontal: false,
        handlerRadius: 8,
        showProgress: false,
        showScale: true,
        showTooltip: false,
      };

      expect(VIEW.setConfig(conf)).to.eql(conf);
    });
  });

  describe('setModelOptions(o: SliderOptions): ModelOptions', () => {
    it('Should return ModelOptions object', () => {
      const conf = {
        minValue: 10,
        maxValue: 30,
        stepSize: 5,
        handlerCount: 2,
        allowReversedValue: false,
      };

      const res = VIEW.setModelOptions(conf);

      expect(res).to.have.deep.keys(MODEL_KEYS);
    });
  });

  // describe('onScaleClick(value: number): void', () => {});

  // describe('onTrackMousedown(e: MouseEvent): void', () => {});
});
