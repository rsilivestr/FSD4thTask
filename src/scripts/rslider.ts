import RSModel from './rslider.model';
import RSView from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';
import RScale from './rslider.scale';

import '../styles/rslider.sass';

export type Slider = {
  container: HTMLElement;
  model: RSModel;
  view: RSView;
  controller: RSController;
  getOptions(): SliderOptions;
  setOptions(options: SliderOptions): SliderOptions;
  setValue(value: number, index: number): number;
  addScale(): Object;
  addPanel(): Object;
  getValues(): number[];
  getValue(index: number): number;
};

export type SliderOptions = {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
  isHorizontal?: boolean;
  handlerRadius?: number;
  tooltip?: boolean;
};

export function create(selector: string, options: SliderOptions = {}) {
  const container: HTMLElement = document.querySelector(selector);

  const model = new RSModel(options);

  const view = new RSView(model, container, options);

  const controller = new RSController(model, view);

  const slider: Slider = {
    container,
    model,
    view,
    controller,
    getOptions() {
      const modelOptions = this.model.getOptions();
      const viewOptions = this.view.getOptions();

      return { ...modelOptions, ...viewOptions };
    },
    setOptions(o = {}) {
      const modelOptions = this.model.setOptions(o);
      const viewOptions = this.view.setOptions(o);

      return { ...modelOptions, ...viewOptions };
    },
    setValue(value, index = 0) {
      return this.model.updateValue(index, value);
    },
    addScale() {
      return new RScale(this);
    },
    addPanel() {
      return new RSPanel(this);
    },
    getValues() {
      return this.model.getValues();
    },
    getValue(index = 0) {
      return this.model.getValues()[index];
    },
  };

  return slider;
}
