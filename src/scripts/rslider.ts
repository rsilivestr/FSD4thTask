// import Controller from './rslider.controller';

// import { RSModel, ModelOptions } from './rslider.model';
// import { RSView, ViewOptions } from './rslider.view';
import RSModel from './rslider.model';
import RSView from './rslider.view';
import RSController from './rslider.controller';

const model = new RSModel({ handlerCount: 2 });

// mock container
const foo = document.getElementById('foo');

const view = new RSView(model, foo);

view.render();

const ctrl = new RSController(model, view);
document.body.addEventListener('mousedown', ctrl.grab.bind(ctrl));
document.body.addEventListener('dragstart', (e) => e.preventDefault());
