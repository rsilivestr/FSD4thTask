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
  markValues: number[];

  update(): number[];
}

export default class RScale implements Scale {
  model: Model;

  modelOptions: ModelOptions;

  view: View;

  viewOptions: ViewOptions;

  container: HTMLElement;

  values: number[];

  scaleMarks: HTMLElement[] = [];

  markValues: number[] = [];

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
    const scale: HTMLElement = document.createElement('ul');
    const { isHorizontal } = this.viewOptions;
    const layout = isHorizontal ? 'horizontal' : 'vertical';
    scale.className = `rslider-scale rslider-scale--layout_${layout}`;

    const { minValue, maxValue, stepSize } = this.modelOptions;

    for (let i = minValue; i < maxValue + stepSize; i += stepSize) {
      // when last step is smaller (scale length isn't multiple of step size)
      if (i > maxValue) i = maxValue;

      const mark = document.createElement('li');
      mark.className = 'rslider-scale__mark';
      mark.innerText = i.toString(10);
      scale.appendChild(mark);

      this.scaleMarks.push(mark);
      this.markValues.push(i);
    }

    scale.addEventListener('click', (e) => {
      this.scaleMarks.forEach((el, index) => {
        if (e.target === el) {
          const val = this.markValues[index];
          this.model.updateValue(0, val);
          // console.log(this.markValues[index]);
        }
      });
    });

    this.container.appendChild(scale);
  }

  update() {
    this.values = this.model.handlerValues;

    // do something, sync values

    return this.values;
  }
}
