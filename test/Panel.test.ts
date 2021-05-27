/* eslint-disable no-undef */
import { expect } from 'chai';

import Panel from '@/components/Panel';
import createSlider from '@/components/Slider';
import { TSliderOptions } from '@/components/types';

describe('Panel(s: Slider)', () => {
  const CONTAINER = document.createElement('div');
  const DEFAULT_CONFIG: Partial<TSliderOptions> = {
    minValue: 0,
    maxValue: 10,
    stepSize: 1,
    handlerCount: 1,
    handlerInteraction: 'block',
    isHorizontal: true,
    showProgress: true,
    showScale: true,
    showTooltip: true,
  };
  const SLIDER = createSlider(CONTAINER, DEFAULT_CONFIG);
  const PANEL = new Panel(SLIDER);
  const labels = Array.from(
    (<HTMLElement>CONTAINER.querySelector('.rslider-panel')).querySelectorAll('label')
  );
  const INPUTS: { [key: string]: HTMLInputElement } = {};
  labels.forEach((label) => {
    const title = label.textContent;
    const input = label.querySelector('input');

    if (title && input) INPUTS[title] = input;
  });
  const KEYDOWN_EVENT = new KeyboardEvent('keydown', { key: 'Enter' });
  const CLICK_EVENT = new MouseEvent('click');
  const INPUT_CHANGE_EVENT = new InputEvent('change');

  beforeEach(() => {
    SLIDER.setConfig(DEFAULT_CONFIG);
  });

  describe('update(values: number[]): void', () => {
    it('Should be a function', () => {
      expect(PANEL.update).to.be.a('function');
    });
  });

  describe('Change handler value', () => {
    it('Should change slider value', () => {
      const newValue = 3;

      const input = INPUTS['Handler #1'];
      input.value = newValue.toString(10);
      input.dispatchEvent(KEYDOWN_EVENT);

      expect(SLIDER.getValue(0)).equal(newValue);
    });
  });

  describe('Change minValue', () => {
    it('Should change slider minValue', () => {
      const newMinValue = -1;

      const input = INPUTS['Min value'];
      input.value = newMinValue.toString(10);
      input.dispatchEvent(KEYDOWN_EVENT);

      expect(SLIDER.getConfig().minValue).to.equal(newMinValue);
    });
  });

  describe('Change maxValue', () => {
    it('Should change slider maxValue', () => {
      const newMaxValue = 13;

      const input = INPUTS['Max value'];
      input.value = newMaxValue.toString(10);
      input.dispatchEvent(KEYDOWN_EVENT);

      expect(SLIDER.getConfig().maxValue).to.equal(newMaxValue);
    });
  });

  describe('Change stepSize', () => {
    it('Should change slider stepSize', () => {
      const newStepSize = 2;

      const input = INPUTS['Step size'];
      input.value = newStepSize.toString(10);
      input.dispatchEvent(KEYDOWN_EVENT);

      expect(SLIDER.getConfig().stepSize).to.equal(newStepSize);
    });
  });

  describe('Change handlerCount', () => {
    it('Should change slider handlerCount', () => {
      const newHandlerCount = 2;

      const input = INPUTS['Handler count'];
      input.value = newHandlerCount.toString(10);
      input.dispatchEvent(KEYDOWN_EVENT);

      expect(SLIDER.getConfig().handlerCount).to.equal(newHandlerCount);
    });
  });

  describe('Change isHorizontal', () => {
    it('Should change slider isHorizontal', () => {
      const { isHorizontal } = DEFAULT_CONFIG;

      const input = INPUTS['Is horizontal'];
      input.dispatchEvent(CLICK_EVENT);
      input.dispatchEvent(INPUT_CHANGE_EVENT);

      expect(SLIDER.getConfig().isHorizontal).to.equal(!isHorizontal);
    });
  });

  describe('Change showProgress', () => {
    it('Should change slider showProgress', () => {
      const { showProgress } = DEFAULT_CONFIG;

      const input = INPUTS['Show progress'];
      input.dispatchEvent(CLICK_EVENT);
      input.dispatchEvent(INPUT_CHANGE_EVENT);

      expect(SLIDER.getConfig().showProgress).to.equal(!showProgress);
    });
  });

  describe('Change showScale', () => {
    it('Should change slider showScale', () => {
      const { showScale } = DEFAULT_CONFIG;

      const input = INPUTS['Show scale'];
      input.dispatchEvent(CLICK_EVENT);
      input.dispatchEvent(INPUT_CHANGE_EVENT);

      expect(SLIDER.getConfig().showScale).to.equal(!showScale);
    });
  });

  describe('Change showTooltip', () => {
    it('Should change slider showTooltip', () => {
      const { showTooltip } = DEFAULT_CONFIG;

      const input = INPUTS['Show tooltip'];
      input.dispatchEvent(CLICK_EVENT);
      input.dispatchEvent(INPUT_CHANGE_EVENT);

      expect(SLIDER.getConfig().showTooltip).to.equal(!showTooltip);
    });
  });
});
