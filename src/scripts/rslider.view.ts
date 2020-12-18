import Model from './interface/Model';
import ModelOptions from './interface/ModelOptions';
import View from './interface/View';
import ViewOptions from './interface/ViewOptions';

export default class RSView implements View {
  container: HTMLElement;
  slider: HTMLElement;
  track: HTMLElement;
  trackRect: ClientRect;
  progress: HTMLElement | null;
  handler: HTMLElement;
  options: ViewOptions = {};
  showProgress: boolean;
  handlerCount: number;
  handlers: HTMLElement[] = [];
  handlerValues: number[];
  handlerCoords: number[] = [];
  modelOptions: ModelOptions;

  constructor(private model: Model, container: HTMLElement, options: ViewOptions = {}) {
    this.container = container;

    this.options = this._validateOptions(options);

    this._init();
  }

  private _init() {
    this.model.addObserver(this);

    this.modelOptions = this.model.getOptions();

    this.handlerCount = this.modelOptions.handlerCount;

    // show progress bar for less than 3 handlers
    this.showProgress = this.handlerCount < 3;

    this.handlerValues = this.model.getValues();

    this.setOptions(this.options);

    this._render();
  }

  private _validateOptions(o: ViewOptions = {}): ViewOptions {
    const result: ViewOptions = {};

    result.isHorizontal = typeof o.isHorizontal === 'boolean' ? o.isHorizontal : true;

    result.handlerRadius =
      typeof o.handlerRadius === 'number' && !Number.isNaN(o.handlerRadius)
        ? o.handlerRadius
        : 8;

    result.tooltip = typeof o.tooltip === 'boolean' ? o.tooltip : true;

    return result;
  }

  private _setCoords(values: number[]): void {
    this.handlerCoords = [];

    const { minValue, maxValue } = this.modelOptions;

    values.forEach((value) => {
      const factor = 100 / (maxValue - minValue);
      const coord = (value - minValue) * factor;
      this.handlerCoords.push(coord);
    });
  }

  private _getScaleFactor(): number {
    const { sliderLength } = this.getRect();
    const r = this.options.handlerRadius;

    return (sliderLength - 2 * r) / sliderLength;
  }

  private _elCreateSlider(): void {
    this.slider = document.createElement('div');
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';
    this.slider.className = `rslider rslider--layout_${layout}`;
    this.container.appendChild(this.slider);
  }

  private _elCreateTrack(): void {
    this.track = document.createElement('div');
    this.track.className = 'rslider__track';
    this.slider.appendChild(this.track);

    this.trackRect = this.track.getBoundingClientRect();
  }

  private _setProgress(): void {
    // if this.handlerCount === 1fff
    let min = 0;
    let max = 100 - this.handlerCoords[0];

    if (this.handlerCount === 2) {
      [min, max] = this.handlerCoords;
      max = 100 - max;
    }

    if (this.options.isHorizontal) {
      this.progress.style.left = `${min.toString()}%`;
      this.progress.style.right = `${max.toString()}%`;
    } else {
      this.progress.style.bottom = `${min.toString()}%`;
      this.progress.style.top = `${max.toString()}%`;
    }
  }

  private _elCreateProgress(): void {
    this.progress = document.createElement('div');
    this.progress.className = 'rslider__progress';
    this.track.appendChild(this.progress);

    this._setProgress();
  }

  private _addTooltip(handler: HTMLElement, index: number): void {
    const tooltip = document.createElement('div');
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';

    tooltip.className = `rslider__tooltip rslider__tooltip--${layout}`;
    tooltip.innerText = this.handlerValues[index].toString(10);

    handler.appendChild(tooltip);
  }

  private _elCreateHandler(id: number): void {
    const handler = document.createElement('div');
    handler.className = 'rslider__handler';
    handler.dataset.id = `${id}`;

    const value = this.handlerCoords[id];
    const coord = value * this._getScaleFactor();

    // add tooltip if set in options
    if (this.options.tooltip) this._addTooltip(handler, id);

    // position handler according to slider layout
    if (this.options.isHorizontal) handler.style.left = `${coord}%`;
    else handler.style.bottom = `${coord}%`;

    this.slider.appendChild(handler);

    this.handlers.push(handler);
  }

  private _render() {
    this._setCoords(this.handlerValues);

    if (this.container == null) {
      throw new Error('There is no element matching provided selector...');
    }

    this._elCreateSlider();

    this._elCreateTrack();

    if (this.showProgress) this._elCreateProgress();

    let handlersRendered = 0;

    while (handlersRendered < this.handlerCount) {
      this._elCreateHandler(handlersRendered);

      handlersRendered += 1;
    }

    // prevent text selection
    this.container.addEventListener('dragstart', (e) => e.preventDefault());

    return this.slider;
  }

  public setModelOptions(o: ModelOptions) {
    this.modelOptions = o;
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
    // update handler values and coordinates
    this.handlerValues = values;
    this._setCoords(values);

    const scaleFactor = this._getScaleFactor();

    this.handlers.forEach((handler, index) => {
      const viewCoord = this.handlerCoords[index] * scaleFactor;

      if (this.options.isHorizontal) {
        this.handlers[index].style.left = `${viewCoord}%`;
      } else {
        this.handlers[index].style.bottom = `${viewCoord}%`;
      }

      const tooltip: HTMLElement = handler.querySelector('.rslider__tooltip');
      if (tooltip) tooltip.innerText = `${this.handlerValues[index]}`;
    });

    if (this.showProgress) this._setProgress();
  }

  // used in rslider.ts
  public _toggleTooltip(value: boolean) {
    // return if nothing changes
    if (this.options.tooltip === value) return;

    // update options
    this.options.tooltip = value;

    if (this.options.tooltip) {
      // add tooltips if tooltip is true
      this.handlers.forEach((handler, index) => {
        this._addTooltip(handler, index);
      });
      return;
    }

    // remove tooltips if tooltip is false
    const tooltips = this.container.getElementsByClassName('rslider__tooltip');
    for (let i = tooltips.length - 1; i >= 0; i -= 1) {
      tooltips[i].remove();
    }
  }

  public getOptions() {
    return this.options;
  }

  public setOptions(options: ViewOptions = {}) {
    const { isHorizontal, handlerRadius, tooltip } = options;

    if (typeof isHorizontal === 'boolean') {
      this.options.isHorizontal = isHorizontal;
    }

    if (typeof handlerRadius === 'number' && !Number.isNaN(handlerRadius)) {
      this.options.handlerRadius = handlerRadius;
    }

    if (typeof tooltip === 'boolean') {
      this._toggleTooltip(tooltip);
    }

    return this.options;
  }

  public getContainer() {
    return this.container;
  }
}
