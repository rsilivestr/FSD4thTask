import '../styles/rslider.sass';

// eslint-disable-next-line no-unused-vars
import RSModel, { Model } from './rslider.model';
// eslint-disable-next-line no-unused-vars
import RSView, { View } from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';

interface Slider {
  container: HTMLElement;
  model: RSModel;
  view: RSView;
  controller: RSController;
  setTooltip(value: boolean): void;
}

interface SliderOptions {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
  isHorizontal?: boolean;
  // valuePrefix?: string;
  // valuePostfix?: string;
  handlerRadius?: number;
  showTooltip?: boolean;
}

function setTooltip(this: Slider, value: boolean) {
  this.view.setTooltip(value);
}

export function create(selector: string, options: SliderOptions) {
  const container: HTMLElement = document.querySelector(selector);

  const model = new RSModel(options);

  const view = new RSView(model, container);
  view.setOptions(options);
  view.render();

  const ctrl = new RSController(model, view);

  container.addEventListener('mousedown', ctrl.grab.bind(ctrl));
  container.addEventListener('dragstart', (e) => e.preventDefault());

  const slider: Slider = {
    container,
    model,
    view,
    controller: ctrl,
    setTooltip,
  };

  return slider;
}


export function addPanel(slider: Slider) {
  const panel = new RSPanel(slider.model, slider.view, slider.container);
  panel.render();

  return panel;
}
