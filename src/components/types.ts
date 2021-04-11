type TSubject = {
  addObserver: (o: Function) => Function[];
  removeObserver: (o: Function) => Function[];
  notifyObservers: (...notifyData: any) => void;
};

type TSliderOptions = {
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

type TSlider = {
  addObserver(o: Function): void;
  removeObserver(o: Function): void;
  getContainer(): HTMLElement;

  setConfig(o: TSliderOptions): TSliderOptions;
  getConfig(): TSliderOptions;

  getValue(index?: number): number;
  setValue(index: number, value: number): number;

  getValues(): number[];
  setValues(values?: number[]): number[];

  rslider(method: string, payload?: any): void;
};

type TModelOptions = {
  [key: string]: any;
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  allowReversedValues?: boolean;
  handlerInteraction?: 'block' | 'move' | 'pass';
};

type TModel = TSubject & {
  getConfig(): TModelOptions;
  setConfig(o?: TModelOptions): TModelOptions;
  getValue(index: number): number | null;
  getValues(): number[];
  setValue(index: number, v: number): number;
  setValues(v: number[]): number[];
};

type TPresenter = {
  getValues(): number[];
  setModelValue(index: number, value: number): number;
};

type TPanel = {
  update(v: number[]): void;
};

type TPanelElements = {
  configDiv: HTMLElement;
  container: HTMLElement;
  valueInputs: HTMLInputElement[];
  configInputs: { [key: string]: HTMLInputElement };
  panel: HTMLElement;
  valuesDiv: HTMLElement;
};

export type {
  TModel,
  TModelOptions,
  TPanel,
  TPanelElements,
  TPresenter,
  TSlider,
  TSliderOptions,
  TSubject,
};
