// eslint-disable-next-line no-unused-vars
import { Observer } from './interfaces';
// eslint-disable-next-line no-unused-vars
import { Model, ModelOptions } from './rslider.model';

export interface ViewOptions {
  isHorizontal?: boolean;
  handlerRadius?: number;
  showTooltip?: boolean;
}

export interface Rect {
  sliderLength: number;
  minCoord: number;
  maxCoord: number;
}

export interface View extends Observer {
  model: Model;
  modelOptions: ModelOptions;
  container: HTMLElement;
  slider: HTMLElement;
  track: HTMLElement;
  trackRect: ClientRect;
  handler: HTMLElement;
  options: ViewOptions;
  handlerCount: number;
  handlers: HTMLElement[];
  handlerCoords: number[];
  // setCoords(values: number[]): void;
  render(): HTMLElement;
  getRect(): Rect;
  update(values: number[]): void;
  setTooltip(value: boolean): void;
  getOptions(): ViewOptions;
  setOptions(options: ViewOptions): ViewOptions;
  getContainer(): HTMLElement;
}

export default class RSView implements View {
  model: Model;

  container: HTMLElement;

  slider: HTMLElement;

  track: HTMLElement;

  trackRect: ClientRect;

  handler: HTMLElement;

  options: ViewOptions = {};

  handlerCount: number;

  handlers: HTMLElement[] = [];

  handlerValues: number[];

  handlerCoords: number[] = [];

  modelOptions: ModelOptions;

  constructor(model: Model, container: HTMLElement, options: ViewOptions = {}) {
    this.model = model;
    model.addObserver(this);

    this.modelOptions = this.model.getOptions();

    this.handlerCount = this.model.getOptions().handlerCount;

    this.container = container;

    this.options.isHorizontal = options.isHorizontal || true;
    this.options.handlerRadius = options.handlerRadius || 8;
    this.options.showTooltip = options.showTooltip || true;

    this.handlerValues = this.model.getValues();
  }

  private setCoords(values: number[]) {
    const { minValue, maxValue } = this.modelOptions;

    values.forEach((value) => {
      const factor = 100 / (maxValue - minValue);
      const coord = (value - minValue) * factor;
      this.handlerCoords.push(coord);
    });
  }

  public render() {
    this.setCoords(this.handlerValues);

    if (this.container == null) {
      throw new Error('There is no element matching provided selector...');
    }

    this.slider = document.createElement('div');
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';
    this.slider.className = `rslider rslider--layout_${layout}`;
    this.container.appendChild(this.slider);

    this.track = document.createElement('div');
    this.track.className = 'rslider__track';
    this.slider.appendChild(this.track);

    this.trackRect = this.track.getBoundingClientRect();

    let handlersRendered = 0;

    while (handlersRendered < this.handlerCount) {
      const handler = document.createElement('div');
      handler.className = 'rslider__handler';
      handler.dataset.id = `${handlersRendered}`;

      const value = this.handlerCoords[handlersRendered];
      const { sliderLength } = this.getRect();
      const coord =
        value *
        ((sliderLength - this.options.handlerRadius * 2) / sliderLength);

      if (this.options.showTooltip) {
        this.addTooltip(handler, handlersRendered);
      }

      if (this.options.isHorizontal) {
        handler.style.left = `${coord}%`;
      } else {
        handler.style.bottom = `${coord}%`;
      }

      this.slider.appendChild(handler);

      this.handlers.push(handler);

      handlersRendered += 1;
    }

    return this.slider;
  }

  // used in rslider.ts
  public getRect() {
    const rect = this.slider.getBoundingClientRect();

    let sliderLength;
    let minCoord;
    let maxCoord;

    if (this.options.isHorizontal) {
      sliderLength = rect.right - rect.left;
      minCoord = rect.left;
      maxCoord = rect.right;
    } else {
      sliderLength = rect.bottom - rect.top;
      minCoord = rect.bottom;
      maxCoord = rect.top;
    }

    return {
      sliderLength,
      minCoord,
      maxCoord,
    };
  }

  public update(values: number[]) {
    const { sliderLength } = this.getRect();
    const { minValue, maxValue } = this.model.getOptions();
    const x = (maxValue - minValue) / 100;
    const y = (sliderLength - this.options.handlerRadius * 2) / sliderLength;
    const scaleFactor = y / x;

    this.handlers.forEach((handler, index) => {
      const coord = values[index] - minValue;
      const viewCoord = coord * scaleFactor;
      if (this.options.isHorizontal) {
        this.handlers[index].style.left = `${viewCoord}%`;
      } else {
        this.handlers[index].style.bottom = `${viewCoord}%`;
      }
      const tooltip: HTMLElement = handler.querySelector('.rslider__tooltip');
      if (tooltip) tooltip.innerText = `${this.handlerValues[index]}`;
    });
  }

  private addTooltip(handler: HTMLElement, index: number) {
    console.log(index, this.handlerValues[index]);
    const tooltip = document.createElement('div');
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';

    tooltip.className = `rslider__tooltip rslider__tooltip--${layout}`;
    tooltip.innerText = this.handlerValues[index].toString(10);

    handler.appendChild(tooltip);

    return this.options;
  }

  // used in rslider.ts
  public setTooltip(value: boolean) {
    // return if nothing changes
    if (this.options.showTooltip === value) return;

    // update options
    this.options.showTooltip = value;

    if (this.options.showTooltip) {
      // add tooltips if showTooltip is true
      this.handlers.forEach((handler, index) => {
        this.addTooltip(handler, index);
      });
      return;
    }

    // remove tooltips if showTooltip is false
    const tooltips = this.container.getElementsByClassName('rslider__tooltip');
    for (let i = tooltips.length - 1; i >= 0; i -= 1) {
      tooltips[i].remove();
    }
  }

  public getOptions() {
    return this.options;
  }

  public setOptions(options: ViewOptions) {
    const { isHorizontal, handlerRadius, showTooltip } = options;

    if (isHorizontal !== undefined && typeof isHorizontal === 'boolean') {
      this.options.isHorizontal = isHorizontal;
    }

    if (handlerRadius !== undefined && typeof handlerRadius === 'number') {
      this.options.handlerRadius = handlerRadius;
    }

    if (showTooltip !== undefined && typeof showTooltip === 'boolean') {
      this.options.showTooltip = showTooltip;
    }

    return this.options;
  }

  public getContainer() {
    return this.container;
  }
}
