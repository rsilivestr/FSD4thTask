// eslint-disable-next-line no-unused-vars
import { Model } from './rslider.model';
// eslint-disable-next-line no-unused-vars
import { View } from './rslider.view';

interface Controller {
  grab(e: MouseEvent): HTMLElement;
}

export default class RSController implements Controller {
  handlers: Array<HTMLElement>;

  grabbedHandler: HTMLElement | null;

  boundGrab: (e: MouseEvent) => HTMLElement;

  boundDrag: (e: MouseEvent) => number;

  boundRelease: () => void;

  model: Model;

  view: View;

  constructor(model: Model, view: View) {
    this.handlers = [];
    this.grabbedHandler = null;

    this.boundGrab = this.grab.bind(this);
    this.boundDrag = this._drag.bind(this);
    this.boundRelease = this._release.bind(this);

    this.model = model;
    this.view = view;

    // Add event listener for handlers
    this.view.getContainer().addEventListener('mousedown', this.boundGrab);
  }

  public grab(e: MouseEvent) {
    const target = <HTMLElement>e.target;

    if (target.closest('.rslider')) {
      // remove selection on drag
      e.preventDefault();
    }

    if (target.classList.contains('rslider__handler')) {
      this.grabbedHandler = target;

      window.addEventListener('mousemove', this.boundDrag);
      window.addEventListener('mouseup', this.boundRelease);
    }

    return target;
  }

  private _drag(e: MouseEvent) {
    const { isHorizontal } = this.view.options;
    const coord = isHorizontal ? e.clientX : e.clientY;
    const { minCoord, maxCoord } = this.view.getRect();

    const relativeCoord = coord - minCoord;

    const handlerPosition = (relativeCoord / (maxCoord - minCoord)) * 100;

    const index = +this.grabbedHandler.dataset.id;

    this.model.updateHandlers(index, handlerPosition);

    return handlerPosition;
  }

  private _release() {
    this.grabbedHandler = null;

    window.removeEventListener('mousemove', this.boundDrag);
    window.removeEventListener('mouseup', this.boundRelease);
  }
}
