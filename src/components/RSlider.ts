import RSModel from './RSModel';
import RSPresenter from './RSPresenter';
import RSView from './RSView';
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

const create = (container: HTMLElement, options: SliderOptions = {}) => {
  const observers: Function[] = [];

  const addObserver = (o: Function) => {
    observers.push(o);
  };

  const notifyObservers = (values: number[]) => {
    observers.forEach((o) => o(values));
  };

  const model = new RSModel(options);

  // Notify slider about model changes
  // Slider then notifies it's own observers (e.g. panel)
  model.addObserver(notifyObservers);

  const modelConfig = model.getConfig();

  const view = new RSView(container, { ...options, ...modelConfig });

  const presenter = new RSPresenter(model, view);
  presenter.init();

  // Facade methods
  const slider: Slider = {
    getContainer() {
      return container;
    },
    getConfig() {
      const mConfig = model.getConfig();
      const vConfig = view.getConfig();

      return { ...mConfig, ...vConfig };
    },
    setConfig(o: SliderOptions) {
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
  };

  return slider;
};

const addControlPanel = (s: Slider) => new RSPanel(s);

export { create, addControlPanel };
