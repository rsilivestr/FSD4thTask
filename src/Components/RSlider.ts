import RSModel, { Model } from './RSModel';
import RSPresenter from './RSPresenter';
import RSView, { View } from './RSView';
import RSPanel from './RSPanel';

import '../styles/rslider.sass';

export type SliderOptions = {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  isHorizontal?: boolean;
  handlerRadius?: number;
  showProgress?: boolean;
  showScale?: boolean;
  showTooltip?: boolean;
};

export interface Slider {
  addObserver(o: Function): void;
  getContainer(): HTMLElement;

  setConfig(o: SliderOptions): SliderOptions;
  getConfig(): SliderOptions;

  getValue(index?: number): number;
  setValue(index: number, value: number): number;

  getValues(): number[];
  setValues(values?: number[]): number[];
}

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

  new RSPresenter(model, view);

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
    addObserver,
  };

  return slider;
}

export function addControlPanel(s: Slider) {
  return new RSPanel(s);
}
