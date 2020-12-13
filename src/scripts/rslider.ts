import RSModel from './rslider.model';
import RSView from './rslider.view';
import RSController from './rslider.controller';
import RSPanel from './rslider.panel';
import RScale from './rslider.scale';

import '../styles/rslider.sass';

type Slider = {
  container: HTMLElement;
  model: RSModel;
  view: RSView;
  controller: RSController;
  setOptions(options: SliderOptions): SliderOptions;
  setValue(value: number, index: number): number;
  addScale(): Object;
  addPanel(): Object;
};

type SliderOptions = {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
  isHorizontal?: boolean;
  handlerRadius?: number;
  showTooltip?: boolean;
};

export function create(selector: string, options: SliderOptions = {}) {
  const container: HTMLElement = document.querySelector(selector);

  const model = new RSModel(options);

  const view = new RSView(model, container);
  view.setOptions(options);
  view.render();

  const controller = new RSController(model, view);

  const slider: Slider = {
    container,
    model,
    view,
    controller,
    setOptions(opt) {
      const modelOptions = this.model.setOptions(opt);

      const viewOptions = this.view.setOptions(opt);

      return { ...modelOptions, ...viewOptions };
    },
    setValue(value, index = 0) {
      return this.model.updateValue(index, value);
    },
    addScale() {
      const scale = new RScale(this.model, this.view, this.container);
      scale.render();

      return scale;
    },
    addPanel() {
      const panel = new RSPanel(this.model, this.view, this.container);
      panel.render();

      return panel;
    },
  };

  return slider;
}
