import ModelOptions from './_interface/ModelOptions';
import Presenter from './_interface/Presenter';
import SliderOptions from './_interface/SliderOptions';
import View from './_interface/View';
import ViewElements from './_interface/ViewElements';
import ViewOptions from './_interface/ViewOptions';

export default class RSView implements View {
  public container: HTMLElement;
  public options: ViewOptions = {};
  public modelOptions: ModelOptions;
  public presenter: Presenter;
  public UI: ViewElements = {};
  public trackRect: ClientRect;
  public handlers: HTMLElement[] = [];
  public values: number[];
  public coords: number[] = [];

  constructor(el: HTMLElement, o: SliderOptions) {
    // Initialize root element
    this.container = el;
    // Initialize options
    this._configure(o);
    // this.setModelOptions(mo);
    // Render
    // this._render();
  }

  private _getRect() {
    const rect = this.UI.slider.getBoundingClientRect();

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

  private _getScaleFactor(): number {
    const { sliderLength } = this._getRect();
    const r = this.options.handlerRadius;

    return (sliderLength - 2 * r) / sliderLength;
  }

  private _elCreateSlider(): void {
    this.UI.slider = document.createElement('div');
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';
    this.UI.slider.className = `rslider rslider--layout_${layout}`;
    this.container.appendChild(this.UI.slider);
  }

  private _elCreateTrack(): void {
    this.UI.track = document.createElement('div');
    this.UI.track.className = 'rslider__track';
    this.UI.slider.appendChild(this.UI.track);

    this.trackRect = this.UI.track.getBoundingClientRect();
  }

  private _setProgress(): void {
    // if this.handlerCount === 1fff
    let min = 0;
    let max = 100 - this.coords[0];

    if (this.modelOptions.handlerCount === 2) {
      [min, max] = this.coords;
      max = 100 - max;
    }

    if (this.options.isHorizontal) {
      this.UI.progress.style.left = `${min.toString()}%`;
      this.UI.progress.style.right = `${max.toString()}%`;
    } else {
      this.UI.progress.style.bottom = `${min.toString()}%`;
      this.UI.progress.style.top = `${max.toString()}%`;
    }
  }

  private _elCreateProgress(): void {
    this.UI.progress = document.createElement('div');
    this.UI.progress.className = 'rslider__progress';
    this.UI.track.appendChild(this.UI.progress);

    this._setProgress();
  }

  private _addTooltip(handler: HTMLElement, index: number): void {
    const tooltip = document.createElement('div');
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';

    tooltip.className = `rslider__tooltip rslider__tooltip--${layout}`;
    tooltip.innerText = this.values[index].toString(10);

    handler.appendChild(tooltip);
  }

  private _elCreateHandler(id: number): void {
    const handler = document.createElement('div');
    handler.className = 'rslider__handler';
    handler.dataset.id = `${id}`;

    const value = this.coords[id];
    const coord = value * this._getScaleFactor();

    // add tooltip if set in options
    if (this.options.tooltip) this._addTooltip(handler, id);

    // position handler according to slider layout
    if (this.options.isHorizontal) handler.style.left = `${coord}%`;
    else handler.style.bottom = `${coord}%`;

    this.UI.slider.appendChild(handler);

    this.handlers.push(handler);
  }

  public render() {
    if (this.container == null) {
      throw new Error('There is no element matching provided selector...');
    }

    this._elCreateSlider();

    this._elCreateTrack();

    let handlersRendered = 0;

    while (handlersRendered < this.modelOptions.handlerCount) {
      this._elCreateHandler(handlersRendered);

      handlersRendered += 1;
    }

    return this.UI.slider;
  }

  private _configure(o: ViewOptions) {
    const { isHorizontal, handlerRadius, tooltip } = o;

    if (typeof isHorizontal === 'boolean') {
      // Set value
      this.options.isHorizontal = isHorizontal;
    } else if (this.options.isHorizontal === undefined) {
      // Default value
      this.options.isHorizontal = true;
    }

    if (typeof handlerRadius === 'number' && !isNaN(handlerRadius)) {
      // Set value
      this.options.handlerRadius = handlerRadius;
    } else if (this.options.handlerRadius === undefined) {
      // Default value
      this.options.handlerRadius = 8;
    }

    if (typeof tooltip === 'boolean') {
      // Set value
      this.options.tooltip = tooltip;
    } else if (this.options.tooltip === undefined) {
      // Default value
      this.options.tooltip = true;
    }

    return this.options;
  }

  private _setCoords(values: number[]): number[] {
    const { minValue, maxValue } = this.modelOptions;

    values.forEach((value) => {
      const factor = 100 / (maxValue - minValue);
      const coord = (value - minValue) * factor;
      this.coords.push(coord);
    });

    return this.coords;
  }

  public config(o?: ViewOptions) {
    if (o) return this._configure(o);

    return this.options;
  }

  public setModelOptions(o: ModelOptions) {
    this.modelOptions = o;

    return this.modelOptions;
  }

  public setValues(v: number[]) {
    this.values = v;

    this._setCoords(v);

    return this.values;
  }

  public notify() {
    this.presenter.update(this);
  }
}
