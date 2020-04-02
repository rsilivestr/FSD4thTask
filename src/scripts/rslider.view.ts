export interface ViewOptions {
  // orientation?: string;
  isHorizontal?: boolean;
  valuePrefix?: string;
  valuePostfix?: string;
  handlerRadius?: number;
  showTooltip?: boolean;
}

interface View {
  render(): any;
}

export default class RSView implements View {
  container: HTMLElement;

  slider: HTMLElement;

  track: HTMLElement;

  handler: HTMLElement;

  options: ViewOptions;

  constructor(container: HTMLElement, options: ViewOptions = {}) {
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

      this.handler = document.createElement('div');
      this.handler.className = 'rslider__handler';
      this.slider.appendChild(this.handler);

      return this.slider;
    }
    throw new Error('There is no element matching provided selector...');
  }

  returnBorders() {
    const rect = this.track.getBoundingClientRect();
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
