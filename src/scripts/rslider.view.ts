type ViewOptions = {
  orientation?: string;
  valuePrefix?: string;
  valuePostfix?: string;
  handlerRadius?: number;
  showTooltip?: boolean;
}

export default class View {
  container: HTMLElement;

  slider: HTMLElement;

  track: HTMLElement;

  handler: HTMLElement;

  // orientation: string;

  // valuePrefix: string;

  // valuePostfix: string;

  // handlerRadius: number;

  // tooltip: boolean;

  options: ViewOptions;

  constructor(selector: string, options: ViewOptions) {
    this.container = document.querySelector(selector);

    this.options.orientation = options.orientation || 'horizontal';
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
    } else {
      throw new Error('There is no element matching provided selector...');
    }
  }
}
