// eslint-disable-next-line no-unused-vars
import { Observer } from './interfaces';
// eslint-disable-next-line no-unused-vars
import { Model, ModelOptions } from './rslider.model';
// eslint-disable-next-line no-unused-vars
import { View, ViewOptions } from './rslider.view';

export interface Scale extends Observer {
  model: Model;
  modelOptions: ModelOptions;
  view: View;
  viewOptions: ViewOptions;
  container: HTMLElement;
  values: number[];
  scaleMarks: HTMLElement[];

  update(): number[];
}

export default class RScale implements Scale {
  model: Model;

  modelOptions: ModelOptions;

  view: View;

  viewOptions: ViewOptions;

  container: HTMLElement;

  values: number[];

  scaleMarks: HTMLElement[];

  constructor(model: Model, view: View, container: HTMLElement) {
    this.model = model;
    model.addObserver(this);
    this.modelOptions = this.model.getOptions();

    this.view = view;
    this.viewOptions = view.getOptions();

    this.container = container;

    this.values = this.model.handlerValues.slice();
  }

  render() {
    const scale: HTMLElement = document.createElement('div');
    const { isHorizontal } = this.viewOptions;
    const layout = isHorizontal ? 'horizontal' : 'vertical';
    scale.className = `rslider__scale rslider__scale--layout_${layout}`;

    // append to slider?
    this.container.appendChild(scale);
  }

  update() {
    this.values = this.model.handlerValues;

    // do something, sync values

    return this.values;
  }
}
