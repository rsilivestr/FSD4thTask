import * as $ from 'jquery';

import RSModel from './rslider.model';
import RSView from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';
import RScale from './rslider.scale';

import '../styles/rslider.sass';

interface Slider {
  container: HTMLElement;
  model: RSModel;
  view: RSView;
  controller: RSController;
  setOptions(options: SliderOptions): SliderOptions;
}

interface SliderOptions {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
  isHorizontal?: boolean;
  handlerRadius?: number;
  showTooltip?: boolean;
}

function create(selector: string, options: SliderOptions = {}) {
  const container: HTMLElement = document.querySelector(selector);

  const model = new RSModel(options);

  const view = new RSView(model, container);
  view.setOptions(options);
  view.render();

  const controller = new RSController(model, view);

  const slider: Slider = {
    container,
    model,
    view,
    controller,
    setOptions(opt: SliderOptions): SliderOptions {
      const modelOptions = this.model.setOptions(opt);

      const viewOptions = this.view.setOptions(opt);

      return { ...modelOptions, ...viewOptions };
    },
  };

  return slider;
}

function addScale(slider: Slider) {
  const scale = new RScale(slider.model, slider.view, slider.container);
  scale.render();

  return scale;
}

function addPanel(slider: Slider) {
  const panel = new RSPanel(slider.model, slider.view, slider.container);
  panel.render();

  return panel;
}

$.fn.extend({
  RSlider: {
    create,
    addScale,
    addPanel,
  },
});
