import { TSubject, TModelOptions, TSliderOptions } from '@/components/types';

export type THandler = {
  getElement(): HTMLElement;
  setPosition(coord: number): void;
  setZIndex(sliderRange: number, coord: number): void;
  toggleTooltip(value?: boolean): boolean;
  toggleLayout(layout: 'horizontal' | 'vertical'): void;
  updateValue(value: number): void;
};

export type THandlerOptions = {
  id: number;
  layout: string;
  tooltip: boolean;
  value: number;
};

export type THandlerElements = {
  handler: HTMLElement;
  tooltip: HTMLElement;
};

export type TProgressCoords = [number, number];

export type TProgress = {
  getElement: () => HTMLElement;
  setCoords: (coords: TProgressCoords) => void;
  toggleHorizontal: (isHorizontal: boolean) => void;
};

export type TScaleElements = {
  slider: HTMLElement;
  scale: HTMLUListElement;
  marks: HTMLLIElement[];
};

export type TScale = TSubject & {
  getElement: () => HTMLUListElement;
  toggleLayout: (layout: 'horizontal' | 'vertical') => void;
  setConfig: (o: Partial<TSliderOptions>) => void;
};

export type TTrackRect = {
  trackLength: number;
  trackMin: number;
  trackMax: number;
};

export type TTrack = TSubject & {
  getElement: () => HTMLElement;
  getRect: () => TTrackRect;
  toggleLayout: (isHorizontal: boolean) => void;
};

export type TViewChildren = {
  handlers: THandler[];
  progress: TProgress | null;
  scale: TScale | null;
  track: TTrack | null;
};

export type TViewElements = {
  activeHandler: HTMLElement | null;
  progress: HTMLElement | null;
  scale: HTMLUListElement | null;
  slider: HTMLElement;
  track: HTMLElement;
};

export type TViewOptions = {
  isHorizontal: boolean;
  handlerRadius: number;
  showProgress: boolean;
  showScale: boolean;
  showTooltip: boolean;
};

export type TView = TSubject & {
  getConfig(): TViewOptions;
  setConfig(o: TViewOptions): void;
  setModelOptions(o: TModelOptions): void;
  setValues(v: number[]): void;
};
