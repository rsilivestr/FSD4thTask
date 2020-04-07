// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';
// import RSView from './rslider.view';
// import RSModel from './rslider.model';

interface Controller {
  grab(e);
  drag(handler): any;
  release(handler): any;
}

export default class RSController implements Controller {
  handlers: Array<HTMLElement>;

  grabbedHandler;

  grabListener;

  boundGrab;

  boundDrag;

  boundRelease;

  model;

  view;

  constructor(model: Subject, view) {
    this.handlers = [];
    this.grabbedHandler = null;

    this.boundGrab = this.grab.bind(this);
    this.boundDrag = this.drag.bind(this);
    this.boundRelease = this.release.bind(this);

    this.model = model;
    this.view = view;
  }

  grab(e) {
    if (e.target.classList.contains('rslider__handler')) {
      this.grabbedHandler = e.target;

      window.addEventListener('mousemove', this.boundDrag);
      window.addEventListener('mouseup', this.boundRelease);
    }
  }

  drag(e) {
    const { isHorizontal } = this.view.options;
    const coord = isHorizontal ? e.clientX : e.clientY;
    const { minCoord, maxCoord } = this.view.getRect();

    const relativeCoord = coord - minCoord;

    const handlerPosition = (relativeCoord / (maxCoord - minCoord)) * 100;

    const index = +this.grabbedHandler.dataset.id;

    this.model.updateHandler(index, handlerPosition);

    return handlerPosition;
  }

  release() {
    this.grabbedHandler = null;

    window.removeEventListener('mousemove', this.boundDrag);
    window.removeEventListener('mouseup', this.boundRelease);

    // save position
  }

  // update(str) {
  //   console.log(`Controller updating, ${str}`);
  //   console.log(this);
  // }
}
