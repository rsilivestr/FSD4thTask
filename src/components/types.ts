type Subject = {
  addObserver: (o: Function) => Function[];
  removeObserver: (o: Function) => Function[];
  notifyObservers: (...notifyData: any) => void;
};

type SliderOptions = {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  allowReversedValues?: boolean;
  isHorizontal?: boolean;
  handlerRadius?: number;
  showProgress?: boolean;
  showScale?: boolean;
  showTooltip?: boolean;
};

type Slider = {
  addObserver(o: Function): void;
  getContainer(): HTMLElement;

  setConfig(o: SliderOptions): SliderOptions;
  getConfig(): SliderOptions;

  getValue(index?: number): number;
  setValue(index: number, value: number): number;

  getValues(): number[];
  setValues(values?: number[]): number[];
};

type ModelOptions = {
  [key: string]: number | boolean;
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  allowReversedValues?: boolean;
};

type Model = Subject & {
  getConfig(): ModelOptions;
  setConfig(o?: ModelOptions): ModelOptions;
  getValue(index: number): number | null;
  getValues(): number[];
  setValue(index: number, v: number): number;
  setValues(v: number[]): number[];
};

type Handler = {
  getElement(): HTMLElement;
  setPosition(coord: number): void;
  toggleTooltip(value?: boolean): boolean;
  toggleLayout(layout: 'horizontal' | 'vertical'): void;
  updateValue(value: number): void;
};

type HandlerOptions = {
  id: number;
  layout: string;
  tooltip: boolean;
  value: number;
};

type HandlerElements = {
  handler: HTMLElement;
  tooltip: HTMLElement;
};

type ProgressCoords = [number, number];

type Progress = {
  getElement: () => HTMLElement;
  setCoords: (coords: ProgressCoords) => void;
  toggleHorizontal: (isHorizontal: boolean) => void;
};

type ScaleElements = {
  container: HTMLElement;
  scale: HTMLUListElement;
  marks: HTMLLIElement[];
};

type Scale = Subject & {
  getElement: () => HTMLUListElement;
  toggleLayout: (layout: 'horizontal' | 'vertical') => void;
  setConfig: (o: ModelOptions) => void;
};

type Track = Subject & {
  getElement: () => HTMLElement;
  getRect: () => any;
  toggleLayout: (isHorizontal: boolean) => void;
};

type ViewChildren = {
  handlers: Handler[];
  progress: Progress;
  scale: Scale;
  track: Track;
};

type ViewElements = {
  activeHandler: HTMLElement;
  progress?: HTMLElement;
  scale?: HTMLUListElement;
  slider?: HTMLElement;
  track?: HTMLElement;
};

type ViewOptions = {
  isHorizontal?: boolean;
  handlerRadius?: number;
  showProgress?: boolean;
  showScale?: boolean;
  showTooltip?: boolean;
};

type View = Subject & {
  getConfig(): ViewOptions;
  setConfig(o: ViewOptions): ViewOptions;
  setModelOptions(o: SliderOptions): ModelOptions;
  setValues(v: number[]): void;
};

type Presenter = {
  getValues(): number[];
  setModelValue(index: number, value: number): number;
};

type Panel = {
  update(v: number[]): void;
};

type PanelElements = {
  configDiv: HTMLElement;
  container: HTMLElement;
  valueInputs: HTMLInputElement[];
  configInputs: { [key: string]: HTMLInputElement };
  panel: HTMLElement;
  valuesDiv: HTMLElement;
};

export type {
  Handler,
  HandlerElements,
  HandlerOptions,
  Model,
  ModelOptions,
  Panel,
  PanelElements,
  Presenter,
  Progress,
  ProgressCoords,
  Scale,
  ScaleElements,
  Slider,
  SliderOptions,
  Subject,
  Track,
  View,
  ViewChildren,
  ViewElements,
  ViewOptions,
};
