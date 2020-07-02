// eslint-disable-next-line no-unused-vars
import { Observer } from './interfaces';
// eslint-disable-next-line no-unused-vars
import { Model, ModelOptions } from './rslider.model';

export interface ViewOptions {
  isHorizontal?: boolean;
  // valuePrefix?: string;
  // valuePostfix?: string;
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
  setCoords(values: number[]): void;
  render(): any;
  getRect(): Rect;
  update(values: number[]): any;
  identifyHandler(handler: HTMLElement): number;
  setTooltip(value: boolean): void;
  getOptions(): ViewOptions;
}

export default class RSView implements View {
  model: Model;

  container: HTMLElement;

  slider: HTMLElement;

  track: HTMLElement;

  trackRect: ClientRect;

  handler: HTMLElement;

  options: ViewOptions;

  handlerCount: number;

  handlers: HTMLElement[] = [];

  handlerCoords: number[] = [];

  modelOptions: ModelOptions;

  constructor(model: Model, container: HTMLElement, options: ViewOptions = {}) {
    this.model = model;
    model.addObserver(this);

    this.modelOptions = this.model.getOptions();

    this.handlerCount = this.model.getOptions().handlerCount;

    this.container = container;

    this.options = {};

    this.options.isHorizontal = options.isHorizontal || true;
    // this.options.valuePrefix = options.valuePrefix || '';
    // this.options.valuePostfix = options.valuePostfix || '';
    this.options.handlerRadius = options.handlerRadius || 8;
    this.options.showTooltip = options.showTooltip || true;
  }

  setCoords(values: number[]) {
    const { minValue, maxValue } = this.modelOptions;

    values.forEach((value) => {
      const factor = 100 / (maxValue - minValue);
      const coord = (value - minValue) * factor;
      this.handlerCoords.push(coord);
    });
  }

  render() {
    this.setCoords(this.model.handlerValues);

    if (this.container !== null) {
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
        const coord = value * ((sliderLength - this.options.handlerRadius * 2) / (sliderLength));

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
    throw new Error('There is no element matching provided selector...');
  }

  getRect() {
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

  update(values: number[]) {
    const { sliderLength } = this.getRect();
    const { minValue, maxValue } = this.model.getOptions();
    const x = (maxValue - minValue) / 100;
    const y = (sliderLength - this.options.handlerRadius * 2) / sliderLength;
    const scaleFactor = y / x;

    this.handlers.forEach((handler, index) => {
      const coord = values[index] - minValue;
      const viewCoord = coord * scaleFactor;
      if (this.options.isHorizontal) {
        // this.handlers[index].style.left = `${viewCoord}%`;
        // eslint-disable-next-line no-param-reassign
        handler.style.left = `${viewCoord}%`;
      } else {
        // this.handlers[index].style.bottom = `${viewCoord}%`;
        // eslint-disable-next-line no-param-reassign
        handler.style.bottom = `${viewCoord}%`;
      }
      const tooltip: HTMLElement = handler.querySelector('.rslider__tooltip');
      if (tooltip) tooltip.innerText = `${this.model.handlerValues[index]}`;
    });
  }

  // check if necessary, delete otherwise
  identifyHandler(handler: HTMLElement) {
    return this.handlers.indexOf(handler);
  }

  private addTooltip(handler: HTMLElement, index: number) {
    // if (!(handler instanceof HTMLElement)) throw new Error('Handler is not an element');

    const tooltip = document.createElement('div');
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';

    tooltip.className = `rslider__tooltip rslider__tooltip--${layout}`;
    tooltip.innerText = this.model.handlerValues[index].toString(10);

    handler.appendChild(tooltip);

    return this.options;
  }

  setTooltip(value: boolean) {
    if (this.options.showTooltip === value) return;

    this.options.showTooltip = value;

    if (this.options.showTooltip === true) {
      this.handlers.forEach((handler, index) => {
        this.addTooltip(handler, index);
      });

      return;
    }

    if (this.options.showTooltip === false) {
      const tooltips = this.container.getElementsByClassName('rslider__tooltip');

      for (let i = tooltips.length - 1; i >= 0; i -= 1) {
        tooltips[i].remove();
      }
    }
  }

  getOptions() {
    return this.options;
  }

  setOptions(options: ViewOptions) {
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

    // postUpdate

    return this.options;
  }
}
