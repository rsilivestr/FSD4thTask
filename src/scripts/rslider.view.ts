// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

export interface ViewOptions {
  isHorizontal?: boolean;
  valuePrefix?: string;
  valuePostfix?: string;
  handlerRadius?: number;
  showTooltip?: boolean;
}

interface View extends Observer {
  render();
}

export default class RSView implements View {
  container: HTMLElement;

  slider: HTMLElement;

  track: HTMLElement;

  trackRect: ClientRect;

  handler: HTMLElement;

  options: ViewOptions;

  handlerCount: number;

  model;

  coord;

  handlers: HTMLElement[] = [];

  handlerCoords: number[] = [];

  modelOptions;

  constructor(model: Subject, container: HTMLElement, options: ViewOptions = {}) {
    this.model = model;
    model.addObserver(this);

    this.modelOptions = this.model.getOptions();

    this.handlerCount = this.model.getOptions().handlerCount;

    this.container = container;

    this.options = {};

    this.options.isHorizontal = options.isHorizontal || true;
    this.options.valuePrefix = options.valuePrefix || '';
    this.options.valuePostfix = options.valuePostfix || '';
    this.options.handlerRadius = options.handlerRadius || 8;
    this.options.showTooltip = options.showTooltip || false;
  }

  setCoords(values) {
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

      const { handlerValues } = this.model;
      let handlersRendered = 0;

      while (handlersRendered < this.handlerCount) {
        const handler = document.createElement('div');
        handler.className = 'rslider__handler';
        handler.dataset.id = `${handlersRendered}`;

        const value = this.handlerCoords[handlersRendered];
        const { sliderLength } = this.getRect();
        const coord = value * ((sliderLength - this.options.handlerRadius * 2) / (sliderLength));

        if (!this.options.showTooltip) {
          const tooltip = document.createElement('div');
          tooltip.className = 'rslider__tooltip';
          tooltip.innerText = handlerValues[handlersRendered];
          handler.appendChild(tooltip);
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

  update(values) {
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
      tooltip.innerText = `${this.model.handlerValues[index]}`;
    });
  }

  identifyHandler(handler) {
    return this.handlers.indexOf(handler);
  }
}
