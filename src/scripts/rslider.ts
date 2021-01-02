import Model from './interface/Model';
import Presenter from './interface/Presenter';
import RSModel from './model';
import RSPresenter from './presenter';
import RSView from './view';
import Slider from './interface/Slider';
import SliderOptions from './interface/SliderOptions';
import View from './interface/View';

import '../styles/rslider.sass';
import RSPanel from './panel';
import Scale from './interface/Scale';

export function create(selector: string, options: SliderOptions = {}) {
  const el: HTMLElement = document.querySelector(selector);
  const model: Model = new RSModel(options);
  const view: View = new RSView(el, options);
  const presenter: Presenter = new RSPresenter(model, view);

  const slider: Slider = {
    el,
    model,
    view,
    presenter,
    config(o?: SliderOptions) {
      const modelOptions = o ? this.model.config(o) : this.model.config();
      const viewOptions = o ? this.view.config(o) : this.view.config();

      return { ...modelOptions, ...viewOptions };
    },
    value(index: number = 0, value: number = null) {
      if (value === null) {
        return this.model.getValue(index);
      }
      return this.model.setValue(index, value);
    },
    values(v: number[] = []) {
      if (v.length === 0) {
        return this.model.getValues();
      }
      return this.model.setValues(v);
    },
    addModelObserver(o: Function) {
      this.model.addObserver(o);
    },
    notifyModelObservers() {
      this.model.notifyObservers();
    },
    addScale() {
      const options = this.config();
      const scale: Scale = this.view.addScale(options);
      scale.addObserver(this.presenter.setModelValue.bind(presenter));

      return scale;
    },
  };

  return slider;
}

export function addControlPanel(s: Slider) {
  return new RSPanel(s);
}
