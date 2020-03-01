// import Model from './rslider.model';
// import View from './rslider.view';

export default class Controller {
  selector: string;

  constructor(selector: string) {
    this.selector = selector;
  }

  // add event listeners for mousedown (grab handler), mousemove, mouseup
  static handleMousedown(target: HTMLElement) {
    console.log(`${target}`);

    if (target.classList.contains('rslider__handler')) {
      // listen to mouse position, notify to model
    }
  }
}
