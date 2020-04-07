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

  constructor(model: Subject, container: HTMLElement, options: ViewOptions = {}) {
    this.model = model;
    model.addObserver(this);

    this.handlerCount = this.model.options.handlerCount;

    this.container = container;

    this.options = {};

    this.options.isHorizontal = options.isHorizontal || true;
    this.options.valuePrefix = options.valuePrefix || '';
    this.options.valuePostfix = options.valuePostfix || '';
    this.options.handlerRadius = options.handlerRadius || 8;
    this.options.showTooltip = options.showTooltip || false;
  }

  render() {
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

        const value = handlerValues[handlersRendered];
        const { sliderLength } = this.getRect();
        const coord = value * ((sliderLength - this.options.handlerRadius * 2) / (sliderLength));

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

  update(index, coord) {
    const { sliderLength } = this.getRect();
    const viewCoord = coord * ((sliderLength - this.options.handlerRadius * 2) / (sliderLength));

    if (this.options.isHorizontal) {
      this.handlers[index].style.left = `${viewCoord}%`;
    } else {
      this.handlers[index].style.bottom = `${viewCoord}%`;
    }
  }

  identifyHandler(handler) {
    return this.handlers.indexOf(handler);
  }
}
