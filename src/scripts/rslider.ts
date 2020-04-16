import '../styles/rslider.sass';

import RSModel from './rslider.model';
import RSView from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';

export function create(selector, options) {
  const container = document.querySelector(selector);

  const model = new RSModel(options);

  const view = new RSView(model, container);
  view.render();

  const ctrl = new RSController(model, view);

  document.body.addEventListener('mousedown', ctrl.grab.bind(ctrl));
  document.body.addEventListener('dragstart', (e) => e.preventDefault());

  return {
    container,
    model,
    view,
    controller: ctrl,
  };
}

export function addPanel({ model, container }) {
  const panel = new RSPanel(model, container);
  panel.render();

  return panel;
}
