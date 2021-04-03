import Model from './Model';
import Panel from './Panel';
import Presenter from './Presenter';
import View from './View';
import { TSlider, TSliderOptions } from './types';

import '../styles/rslider.sass';

const create = (container: HTMLElement, options: TSliderOptions = {}) => {
  const observers: Function[] = [];

  const addObserver = (o: Function) => {
    observers.push(o);
  };

  const notifyObservers = (values: number[]) => {
    observers.forEach((o) => o(values));
  };

  const model = new Model(options);

  // Notify slider about model changes
  // Slider then notifies it's own observers (e.g. panel)
  model.addObserver(notifyObservers);

  const modelConfig = model.getConfig();

  const view = new View(container, { ...options, ...modelConfig });

  const presenter = new Presenter(model, view);
  presenter.init();

  const slider: TSlider = {
    // Human facade
    getContainer() {
      return container;
    },
    getConfig() {
      const mConfig = model.getConfig();
      const vConfig = view.getConfig();

      return { ...mConfig, ...vConfig };
    },
    setConfig(o: TSliderOptions) {
      const mConfig = model.setConfig(o);
      const vConfig = view.setConfig(o);

      return { ...mConfig, ...vConfig };
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
    addObserver,

    // JQuery fasade
    rslider(method: string, payload?: any) {
      switch (method) {
        case 'getContainer':
          return this.getContainer();

        case 'getConfig':
          return this.getConfig();

        case 'setConfig':
          return this.setConfig(payload as TSliderOptions);

        case 'getValue':
          return this.getValue((payload as number) || 0);

        case 'getValues':
          return this.getValues();

        case 'setValue': {
          const { index, value } = payload;
          return this.setValue(index, value);
        }
        case 'setValues':
          return this.setValues(payload || []);

        default:
          return null;
      }
    },
  };

  return slider;
};

const addControlPanel = (s: TSlider) => new Panel(s);

export { create, addControlPanel };
