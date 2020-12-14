import RSModel, { Model } from './rslider.model';
import RSView, { View } from './rslider.view';
import RSController, { Controller } from './rslider.controller';
import RSPanel, { Panel } from './rslider.panel';
import RScale, { Scale } from './rslider.scale';

import '../styles/rslider.sass';

export type Slider = {
  container: HTMLElement;
  model: Model;
  view: View;
  controller: Controller;

  getOptions(): SliderOptions;
  setOptions(options: SliderOptions): SliderOptions;
  getValue(index: number): number;
  getValues(): number[];
  setValue(value: number, index: number): number;
  addPanel(): Panel;
  addScale(): Scale;
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
    getValue(index = 0) {
      return this.model.getValues()[index];
    },
    getValues() {
      return this.model.getValues();
    },
    setValue(value, index = 0) {
      return this.model.updateValue(index, value);
    },
    addPanel() {
      return new RSPanel(this);
    },
    addScale() {
      return new RScale(this);
    },
  };

  return slider;
}
