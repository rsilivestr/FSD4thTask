import { Model } from './rslider.model';
import { View } from './rslider.view';

export class Controller {
  view: View;
  model: Model;

  constructor(view: View, model: Model) {
    this.view = view;
    this.model = model;
  }

  // add event listeners for mousedown (grab handler), mousemove, mouseup
}