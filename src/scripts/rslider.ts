import RSModel from './rslider.model';
import RSView from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';

const model = new RSModel({ handlerCount: 2 });

model.setOptions({ handlerCount: 2 });

// mock container
const foo = document.getElementById('foo');

// const opt = { isHorizontal: false };

const view = new RSView(model, foo);

view.render();

const ctrl = new RSController(model, view);
document.body.addEventListener('mousedown', ctrl.grab.bind(ctrl));
document.body.addEventListener('dragstart', (e) => e.preventDefault());

const panel = new RSPanel(model);
panel.render();
