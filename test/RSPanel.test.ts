/* eslint-disable no-undef */
import { expect } from 'chai';
import { create } from '../src/components/RSlider';
import RSPanel from '../src/components/RSPanel';
import { SliderOptions } from '../src/components/interfaces';

describe('RSPanel(s: Slider)', () => {
  const div = document.createElement('div');
  const config: SliderOptions = {
    minValue: 0,
    maxValue: 10,
    stepSize: 1,
    handlerCount: 1,
    isHorizontal: true,
    showProgress: true,
    showScale: true,
    showTooltip: true,
  };
  const slider = create(div, config);
  const panel = new RSPanel(slider);
  const labels = Array.from(
    div.querySelector('.rslider-panel').querySelectorAll('label')
  );
  const inputs: { [key: string]: HTMLInputElement } = {};
  labels.forEach((label) => {
    const title = label.textContent;
    const input = label.querySelector('input');

    inputs[title] = input;
  });
  const keydownEnter = new KeyboardEvent('keydown', { key: 'Enter' });
  const clickEvent = new MouseEvent('click');

  beforeEach(() => {
    slider.setConfig(config);
  });

  describe('update(values: number[]): void', () => {
    it('Should do something', () => {
      expect(panel.update).to.be.a('function');
    });
  });

  describe('Change handler value', () => {
    it('Should change slider value', () => {
      const newValue = 3;

      const input = inputs['Handler #1'];
      // Set value
      input.value = newValue.toString(10);
      // Dispatch event
      input.dispatchEvent(keydownEnter);

      expect(slider.getValue(0)).equal(newValue);
    });
  });

  describe('Change minValue', () => {
    it('Should change slider minValue', () => {
      const newMinValue = -1;

      const input = inputs['Min value'];
      input.value = newMinValue.toString(10);
      input.dispatchEvent(keydownEnter);

      expect(slider.getConfig().minValue).to.equal(newMinValue);
    });
  });

  describe('Change maxValue', () => {
    it('Should change slider maxValue', () => {
      const newMaxValue = 13;

      const input = inputs['Max value'];
      input.value = newMaxValue.toString(10);
      input.dispatchEvent(keydownEnter);

      expect(slider.getConfig().maxValue).to.equal(newMaxValue);
    });
  });

  describe('Change stepSize', () => {
    it('Should change slider stepSize', () => {
      const newStepSize = 2;

      const input = inputs['Step size'];
      input.value = newStepSize.toString(10);
      input.dispatchEvent(keydownEnter);

      expect(slider.getConfig().stepSize).to.equal(newStepSize);
    });
  });

  describe('Change handlerCount', () => {
    it('Should change slider handlerCount', () => {
      const newHandlerCount = 2;

      const input = inputs['Handler count'];
      input.value = newHandlerCount.toString(10);
      input.dispatchEvent(keydownEnter);

      expect(slider.getConfig().handlerCount).to.equal(newHandlerCount);
    });
  });

  describe('Change isHorizontal', () => {
    it('Should change slider isHorizontal', () => {
      const { isHorizontal } = slider.getConfig();

      const input = inputs['Is horizontal'];
      input.dispatchEvent(clickEvent);

      expect(slider.getConfig().isHorizontal).to.equal(!isHorizontal);
    });
  });

  describe('Change showProgress', () => {
    it('Should change slider showProgress', () => {
      const { showProgress } = slider.getConfig();

      const input = inputs['Show progress'];
      input.dispatchEvent(clickEvent);

      expect(slider.getConfig().showProgress).to.equal(!showProgress);
    });
  });

  describe('Change showScale', () => {
    it('Should change slider showScale', () => {
      const { showScale } = slider.getConfig();

      const input = inputs['Show scale'];
      input.dispatchEvent(clickEvent);

      expect(slider.getConfig().showScale).to.equal(!showScale);
    });
  });

  describe('Change showTooltip', () => {
    it('Should change slider showTooltip', () => {
      const { showTooltip } = slider.getConfig();

      const input = inputs['Show tooltip'];
      input.dispatchEvent(clickEvent);

      expect(slider.getConfig().showTooltip).to.equal(!showTooltip);
    });
  });
});
