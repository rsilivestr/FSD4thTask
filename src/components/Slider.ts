import Model from './Model';
import Panel from './Panel';
import Presenter from './Presenter';
import { View } from './views';
import { TSlider, TSliderOptions, TSliderOptionsPartial } from './types';

import '../styles/rslider.sass';

export default (container: HTMLElement, options: TSliderOptionsPartial = {}) => {
  const observers: Function[] = [];

  const addObserver = (o: Function) => {
    observers.push(o);
  };

  const removeObserver = (o: Function) => {
    const indexToRemove = observers.indexOf(o);

    observers.splice(indexToRemove, 1);
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
      model.setConfig(o);
      view.setConfig(o);
    },
    getValue(index: number = 0) {
      return model.getValue(index);
    },
    setValue(index: number, value: number) {
      const valid =
        typeof index === 'number' &&
        !Number.isNaN(index) &&
        typeof value === 'number' &&
        !Number.isNaN(value);

      if (!valid) return;

      model.setValue(index, value);
    },
    getValues() {
      return model.getValues();
    },
    setValues(values: number[] = []) {
      if (!Array.isArray(values)) return;

      const numericValues = values.filter(
        (value) => typeof value === 'number' && !Number.isNaN(value)
      );
      const { handlerCount } = this.getConfig();

      if (numericValues.length !== handlerCount) return;

      model.setValues(values);
    },
    addObserver,
    removeObserver,

    // JQuery facade
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

        case 'addObserver':
          return this.addObserver(payload);

        case 'removeObserver':
          return this.removeObserver(payload);

        case 'addControlPanel':
          return new Panel(this);

        default:
          return null;
      }
    },
  };

  return slider;
};
