export type TSubject = {
  addObserver: (o: Function) => Function[];
  removeObserver: (o: Function) => Function[];
  notifyObservers: (...notifyData: any) => void;
};

export type TSliderOptions = {
  minValue: number;
  maxValue: number;
  stepSize: number;
  handlerCount: number;
  allowReversedValues: boolean;
  handlerInteraction: 'block' | 'move' | 'pass';
  isHorizontal: boolean;
  handlerRadius: number;
  showProgress: boolean;
  showScale: boolean;
  showTooltip: boolean;
};

export type TSliderOptionsPartial = {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  allowReversedValues?: boolean;
  handlerInteraction?: 'block' | 'move' | 'pass';
  isHorizontal?: boolean;
  handlerRadius?: number;
  showProgress?: boolean;
  showScale?: boolean;
  showTooltip?: boolean;
};

export type TSlider = {
  addObserver(o: Function): void;
  removeObserver(o: Function): void;
  getContainer(): HTMLElement;

  setConfig(o: TSliderOptionsPartial): void;
  getConfig(): TSliderOptions;

  getValue(index?: number): number;
  setValue(index: number, value: number): void;

  getValues(): number[];
  setValues(values?: number[]): void;

  rslider(method: string, payload?: any): void;
};

export type TModelOptions = {
  minValue: number;
  maxValue: number;
  stepSize: number;
  handlerCount: number;
  allowReversedValues: boolean;
  handlerInteraction: 'block' | 'move' | 'pass';
};

export type TModelOptionsPartial = {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  allowReversedValues?: boolean;
  handlerInteraction?: 'block' | 'move' | 'pass';
};

export type TModel = TSubject & {
  getConfig(): TModelOptions;
  setConfig(o: TModelOptionsPartial): void;
  getValue(index: number): number | null;
  getValues(): number[];
  setValue(index: number, v: number): void;
  setValues(v: number[]): void;
};

export type TPresenter = {
  getValues(): number[];
  setModelValue(index: number, value: number): void;
};

export type TPanel = {
  update(v: number[]): void;
};

export type TPanelElements = {
  configDiv: HTMLElement;
  container: HTMLElement;
  valueInputs: HTMLInputElement[];
  configInputs: { [key: string]: HTMLInputElement };
  panel: HTMLElement;
  valuesDiv: HTMLElement;
};
