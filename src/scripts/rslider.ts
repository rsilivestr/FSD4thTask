import '../styles/rslider.sass';

// eslint-disable-next-line no-unused-vars
import RSModel from './rslider.model';
// eslint-disable-next-line no-unused-vars
import RSView from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';
import RScale from './rslider.scale';

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

  const controller = new RSController(model, view);

  container.addEventListener('mousedown', controller.grab.bind(controller));
  container.addEventListener('dragstart', (e) => e.preventDefault());

  const slider: Slider = {
    container,
    model,
    view,
    controller,
    setTooltip,
  };

  return slider;
}

export function addScale(slider: Slider) {
  const scale = new RScale(slider.model, slider.view, slider.container);
  scale.render();

  return scale;
}

export function addPanel(slider: Slider) {
  const panel = new RSPanel(slider.model, slider.view, slider.container);
  panel.render();

  return panel;
}
