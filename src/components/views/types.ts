import { TSubject, TModelOptions, TSliderOptions } from '@/components/types';

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

export type {
  THandler,
  THandlerElements,
  THandlerOptions,
  TProgress,
  TProgressCoords,
  TScale,
  TScaleElements,
  TTrack,
  TView,
  TViewChildren,
  TViewElements,
  TViewOptions,
};
