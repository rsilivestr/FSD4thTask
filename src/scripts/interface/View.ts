import ModelOptions from './ModelOptions';
import Observer from './Observer';
import Rect from './Rect';
import ViewOptions from './ViewOptions';

export default interface View extends Observer {
  modelOptions: ModelOptions;
  container: HTMLElement;
  slider: HTMLElement;
  track: HTMLElement;
  trackRect: ClientRect;
  handler: HTMLElement;
  options: ViewOptions;
  showProgress: boolean;
  handlerCount: number;
  handlers: HTMLElement[];
  handlerCoords: number[];
  getRect(): Rect;
  update(values: number[]): void;
  _toggleTooltip(value: boolean): void;
  getOptions(): ViewOptions;
  setOptions(options: ViewOptions): ViewOptions;
  getContainer(): HTMLElement;
}
