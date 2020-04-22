import '../styles/rslider.sass';

// eslint-disable-next-line no-unused-vars
import RSModel, { Model, ModelOptions } from './rslider.model';
// eslint-disable-next-line no-unused-vars
import RSView, { View } from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';

interface Slider {
  container: HTMLElement;
  model: RSModel;
  view: RSView;
  controller: RSController;
}

export function create(selector: string, options: ModelOptions) {
  const container: HTMLElement = document.querySelector(selector);

  const model: Model = new RSModel(options);

  const view = new RSView(model, container);
  view.render();

  const ctrl = new RSController(model, view);

  document.body.addEventListener('mousedown', ctrl.grab.bind(ctrl));
  document.body.addEventListener('dragstart', (e) => e.preventDefault());

  const slider: Slider = {
    container,
    model,
    view,
    controller: ctrl,
  };

  return slider;
}

export function addPanel(slider: Slider) {
  const panel = new RSPanel(slider.model, slider.container);
  panel.render();

  return panel;
}
