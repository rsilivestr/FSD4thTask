// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';
// eslint-disable-next-line no-unused-vars
import { Model } from './rslider.model';
// eslint-disable-next-line no-unused-vars
import { View } from './rslider.view';

interface Controller {
  grab(e: any): any;
  drag(e: any): number;
  release(): any;
}

export default class RSController implements Controller {
  handlers: Array<HTMLElement>;

  grabbedHandler: HTMLElement | null;

  grabListener: any;

  boundGrab: any;

  boundDrag: any;

  boundRelease: any;

  model: Model;

  view: View;

  constructor(model: Model, view: View) {
    this.handlers = [];
    this.grabbedHandler = null;

    this.boundGrab = this.grab.bind(this);
    this.boundDrag = this.drag.bind(this);
    this.boundRelease = this.release.bind(this);

    this.model = model;
    this.view = view;
  }

  grab(e: any) {
    if (e.target.classList.contains('rslider__handler')) {
      this.grabbedHandler = e.target;

      window.addEventListener('mousemove', this.boundDrag);
      window.addEventListener('mouseup', this.boundRelease);
    }
  }

  drag(e: MouseEvent) {
    const { isHorizontal } = this.view.options;
    const coord = isHorizontal ? e.clientX : e.clientY;
    const { minCoord, maxCoord } = this.view.getRect();

    const relativeCoord = coord - minCoord;

    const handlerPosition = (relativeCoord / (maxCoord - minCoord)) * 100;

    const index = +this.grabbedHandler.dataset.id;

    this.model.updateHandlers(index, handlerPosition);

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
