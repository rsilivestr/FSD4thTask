// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';
// import RSView from './rslider.view';
// import RSModel from './rslider.model';

interface Controller extends Observer {
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
    // if (e.target.classList.contains('rslider__handler')
    // && this.handlers.indexOf(e.target) !== -1) {
    if (e.target.classList.contains('rslider__handler')) {
      const handler = e.target;

      this.grabbedHandler = handler;
      window.addEventListener('mousemove', this.boundDrag);
      window.addEventListener('mouseup', this.boundRelease);

      return handler;
    }
    return null;
  }

  drag(e) {
    const { isHorizontal } = this.view.options;
    const coord = isHorizontal ? e.clientX : e.clientY;
    const { min, max } = this.view.returnBorders();
    const relativeCoord = coord - min;

    let handlerPosition;

    if (relativeCoord < 0) {
      handlerPosition = 0;
    } else if (relativeCoord > max - min) {
      // hardcored handler diameter 16px
      // handlerPosition = 100 - (16 * 100) / (max - min);
      handlerPosition = 100;
    } else {
      // hardcored handler diameter 16px
      // handlerPosition = (relativeCoord / (max - min + 16)) * 100;
      handlerPosition = (relativeCoord / (max - min)) * 100;
    }

    this.model.updateHandler(handlerPosition);
    // this.grabbedHandler.style = isHorizontal
    // ? `left: ${handlerPosition}%` : `bottom: ${handlerPosition}%`;

    return handlerPosition;
  }

  release() {
    this.grabbedHandler = null;

    window.removeEventListener('mousemove', this.boundDrag);
    window.removeEventListener('mouseup', this.boundRelease);

    // save position
  }

  update(str) {
    console.log(`Controller updating, ${str}`);
    console.log(this);
  }
}
