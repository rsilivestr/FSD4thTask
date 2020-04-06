// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

export interface ViewOptions {
  // orientation?: string;
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

  // handlers = [];

  constructor(model: Subject, container: HTMLElement, options: ViewOptions = {}) {
    this.model = model;
    model.addObserver(this);

    this.handlerCount = this.model.options.handlerCount;

    this.container = container;

    this.options = {};

    // this.options.orientation = options.orientation || 'horizontal';
    this.options.isHorizontal = options.isHorizontal || true;
    this.options.valuePrefix = options.valuePrefix || '';
    this.options.valuePostfix = options.valuePostfix || '';
    this.options.handlerRadius = options.handlerRadius || 16;
    this.options.showTooltip = options.showTooltip || false;
  }

  render() {
    if (this.container !== null) {
      this.slider = document.createElement('div');
      this.slider.className = 'rslider rslider--layout_horizontal';
      this.container.appendChild(this.slider);

      this.track = document.createElement('div');
      this.track.className = 'rslider__track';
      this.slider.appendChild(this.track);

      this.trackRect = this.track.getBoundingClientRect();

      // this.handler = document.createElement('div');
      // this.handler.className = 'rslider__handler';
      // this.slider.appendChild(this.handler);

      let handlersRendered = 0;
      while (handlersRendered < this.handlerCount) {
        const handler = document.createElement('div');
        handler.className = 'rslider__handler';
        handler.dataset.id = `${handlersRendered}`;
        this.slider.appendChild(handler);

        this.handlers.push(handler);

        handlersRendered += 1;
      }

      return this.slider;
    }
    throw new Error('There is no element matching provided selector...');
  }

  update(index, coord) {
    // should be computed each time to prevent bugs when zoomed
    const sliderRect = this.slider.getBoundingClientRect();
    const sliderLength = sliderRect.right - sliderRect.left;

    const handlerRect = this.handlers[index].getBoundingClientRect();
    const handlerDiameter = handlerRect.right - handlerRect.left;

    const viewCoord = coord * ((sliderLength - handlerDiameter) / (sliderLength));

    this.handlers[index].style.left = `${viewCoord}%`;
  }

  returnBorders() {
    // should be computed each time to prevent bugs when zoomed
    const rect = this.slider.getBoundingClientRect();

    if (this.options.isHorizontal) {
      return {
        min: rect.left,
        max: rect.right,
      };
    }
    return {
      min: rect.bottom,
      max: rect.top,
    };
  }

  identifyHandler(handler) {
    return this.handlers.indexOf(handler);
  }
}
