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

type THandler = {
  getElement(): HTMLElement;
  setPosition(coord: number): void;
  setZIndex(sliderRange: number, coord: number): void;
  toggleTooltip(value?: boolean): boolean;
  toggleLayout(layout: 'horizontal' | 'vertical'): void;
  updateValue(value: number): void;
};

type THandlerOptions = {
  id: number;
  layout: string;
  tooltip: boolean;
  value: number;
};

type THandlerElements = {
  handler: HTMLElement;
  tooltip: HTMLElement;
};

type TProgressCoords = [number, number];

type TProgress = {
  getElement: () => HTMLElement;
  setCoords: (coords: TProgressCoords) => void;
  toggleHorizontal: (isHorizontal: boolean) => void;
};

type TScaleElements = {
  slider: HTMLElement;
  scale: HTMLUListElement;
  marks: HTMLLIElement[];
};

type TScale = TSubject & {
  getElement: () => HTMLUListElement;
  toggleLayout: (layout: 'horizontal' | 'vertical') => void;
  setConfig: (o: TModelOptions) => void;
};

type TTrack = TSubject & {
  getElement: () => HTMLElement;
  getRect: () => any;
  toggleLayout: (isHorizontal: boolean) => void;
};

type TViewChildren = {
  handlers: THandler[];
  progress: TProgress;
  scale: TScale;
  track: TTrack;
};

type TViewElements = {
  activeHandler: HTMLElement;
  progress?: HTMLElement;
  scale?: HTMLUListElement;
  slider?: HTMLElement;
  track?: HTMLElement;
};

type TViewOptions = {
  isHorizontal?: boolean;
  handlerRadius?: number;
  showProgress?: boolean;
  showScale?: boolean;
  showTooltip?: boolean;
};

type TView = TSubject & {
  getConfig(): TViewOptions;
  setConfig(o: TViewOptions): TViewOptions;
  setModelOptions(o: TSliderOptions): TModelOptions;
  setValues(v: number[]): void;
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
  THandler,
  THandlerElements,
  THandlerOptions,
  TModel,
  TModelOptions,
  TPanel,
  TPanelElements,
  TPresenter,
  TProgress,
  TProgressCoords,
  TScale,
  TScaleElements,
  TSlider,
  TSliderOptions,
  TSubject,
  TTrack,
  TView,
  TViewChildren,
  TViewElements,
  TViewOptions,
};
