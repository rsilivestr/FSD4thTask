// Subject (Observer pattern)
export interface Subject {
  addObserver: (o: Function) => Function[];
  removeObserver: (o: Function) => Function[];
  notifyObservers: (...notifyData: any) => void;
}

// Slider
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

// Model
export type ModelOptions = {
  [key: string]: any;
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
};

export interface Model extends Subject {
  getConfig(): ModelOptions;
  setConfig(o?: ModelOptions): ModelOptions;
  getValue(index: number): number | null;
  getValues(): number[];
  setValue(index: number, v: number): number;
  setValues(v: number[]): number[];
}

// Subviews
export interface Handler {
  getElement(): HTMLElement;
  setPosition(coord: number): void;
  toggleTooltip(value?: boolean): boolean;
  toggleLayout(layout: 'horizontal' | 'vertical'): void;
  updateValue(value: number): void;
}

export type HandlerOptions = {
  id: number;
  layout: string;
  tooltip: boolean;
  value: number;
};

export type HandlerElements = {
  handler: HTMLElement;
  tooltip: HTMLElement;
};

export type ProgressCoords = [number, number];

export interface Progress {
  getElement: () => HTMLDivElement;
  setCoords: (coords: ProgressCoords) => void;
  toggleHorizontal: (isHorizontal: boolean) => void;
}

export interface Scale extends Subject {
  getElement: () => HTMLElement;
  toggleLayout: (layout: 'horizontal' | 'vertical') => void;
  setConfig: (o: ModelOptions) => void;
  setValues: (v: number[]) => void;
}

export interface Track extends Subject {
  getElement: () => HTMLDivElement;
  getRect: () => any;
  toggleLayout: (isHorizontal: boolean) => void;
}

// Main view
export type ViewChildren = {
  handlers: Handler[];
  progress: Progress;
  scale: Scale;
  track: Track;
};

export type ViewElements = {
  activeHandler: HTMLElement;
  progress?: HTMLElement;
  scale?: HTMLElement;
  slider?: HTMLElement;
  track?: HTMLDivElement;
};

export type ViewOptions = {
  isHorizontal?: boolean;
  handlerRadius?: number;
  showProgress?: boolean;
  showScale?: boolean;
  showTooltip?: boolean;
};

export interface View extends Subject {
  getConfig(): ViewOptions;
  setConfig(o: ViewOptions): ViewOptions;
  setModelOptions(o: SliderOptions): ModelOptions;
  setValues(v: number[]): void;
  update(): number[];
}

// Presenter
export interface Presenter {
  getValues(): number[];
  setModelValue(index: number, value: number): number;
}

// Control panel
export interface Panel {
  update(v: number[]): void;
}

export type PanelElements = {
  configDiv: HTMLDivElement;
  container: HTMLElement;
  valueInputs: HTMLInputElement[];
  configInputs: { [key: string]: HTMLInputElement };
  panel: HTMLElement;
  valuesDiv: HTMLDivElement;
};
