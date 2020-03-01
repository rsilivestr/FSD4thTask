import Controller from './rslider.controller';
// import Model from './rslider.model';
import View from './rslider.view';
// import './styles/rslider.sass';

export default function init(selector: string) {
  // const ctrl = new Controller(selector);
  const view = new View(selector);

  view.render(selector);

  document.querySelector(selector).addEventListener('mousedown', (e) => {
    Controller.handleMousedown(<HTMLElement>e.target);
  });
}
