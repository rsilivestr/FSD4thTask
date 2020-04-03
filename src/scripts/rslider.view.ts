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

  model;

  coord;

  constructor(model: Subject, container: HTMLElement, options: ViewOptions = {}) {
    this.model = model;
    model.addObserver(this);

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

      this.handler = document.createElement('div');
      this.handler.className = 'rslider__handler';
      this.slider.appendChild(this.handler);

      return this.slider;
    }
    throw new Error('There is no element matching provided selector...');
  }

  update(coord) {
    // this.handler.style = this.options.isHorizontal ? `left: ${coord}%` : `bottom: ${coord}%`;
    // console.log(`Imma updating, ${str}!`);
    // const trackLength = this.trackRect.right - this.trackRect.left;

    // hardcoded css
    const sliderLength = 300;
    const handlerRadius = 8;
    const viewCoord = coord * ((sliderLength - handlerRadius * 2) / (sliderLength));

    this.handler.style.left = `${viewCoord}%`;
  }

  returnBorders() {
    const rect = this.trackRect;

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
}
