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

export function create(container: HTMLElement, options: SliderOptions = {}) {
  const observers: Function[] = [];

  const addObserver = (o: Function) => {
    observers.push(o);
  };

  const notifyObservers = (values: number[]) => {
    observers.forEach((o) => o(values));
  };

  const model: Model = new RSModel(options);

  // Notify slider about model changes
  // Slider then notifies it's own observers (e.g. panel)
  model.addObserver(notifyObservers);

  const modelConfig = model.getConfig();

  const view: View = new RSView(container, { ...options, ...modelConfig });

  const presenter: Presenter = new RSPresenter(model, view);

  // Facade methods
  const slider: Slider = {
    getContainer() {
      return container;
    },
    getConfig() {
      const modelConfig = model.getConfig();
      const viewConfig = view.getConfig();

      return { ...modelConfig, ...viewConfig };
    },
    setConfig(o: SliderOptions) {
      const modelConfig = model.setConfig(o);

      const viewConfig = view.setConfig(o);

      view.setModelOptions(modelConfig);

      return { ...modelConfig, ...viewConfig };
    },
    getValue(index: number = 0) {
      return model.getValue(index);
    },
    setValue(index: number, value: number) {
      return model.setValue(index, value);
    },
    getValues() {
      return model.getValues();
    },
    setValues(v: number[] = []) {
      return model.setValues(v);
    },
    addScale() {
      const options = this.getConfig();
      const scale: Scale = view.addScale(options);
      scale.addObserver(presenter.setModelValue.bind(presenter));

      return scale;
    },
    addObserver,
  };

  return slider;
}

export function addControlPanel(s: Slider) {
  return new RSPanel(s);
}

// jq
$.fn.extend({
  rslider(options: SliderOptions) {
    return create((<JQuery>this)[0], options);
  },
});

$.fn.extend({
  rspanel(slider: Slider) {
    return addControlPanel(slider);
  },
});
