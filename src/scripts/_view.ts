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
  }

  private _getRect() {
    const rect = this.UI.slider.getBoundingClientRect();

    const { isHorizontal } = this.options;

    return {
      sliderLength: isHorizontal ? rect.right - rect.left : rect.bottom - rect.top,
      minCoord: isHorizontal ? rect.left : rect.bottom,
      maxCoord: isHorizontal ? rect.right : rect.top,
    };
  }

  private _getScaleFactor(): number {
    const { sliderLength } = this._getRect();
    const r = this.options.handlerRadius;

    return (sliderLength - 2 * r) / sliderLength;
  }

  private _elCreateSlider(): void {
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';
    // Create element
    this.UI.slider = document.createElement('div');
    this.UI.slider.className = `rslider rslider--layout_${layout}`;
    // Append
    this.container.appendChild(this.UI.slider);
  }

  private _elCreateTrack(): void {
    // Create element
    this.UI.track = document.createElement('div');
    this.UI.track.className = 'rslider__track';
    // Append
    this.UI.slider.appendChild(this.UI.track);
    // Save track geometry
    this.trackRect = this.UI.track.getBoundingClientRect();
  }

  private _setProgress(): void {
    // if this.handlerCount === 1
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
    // Create element
    this.UI.progress = document.createElement('div');
    this.UI.progress.className = 'rslider__progress';
    // Append
    this.UI.track.appendChild(this.UI.progress);
    // Update progress
    this._setProgress();
  }

  private _addTooltip(handler: HTMLElement, index: number): void {
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';
    // Create element
    const tooltip = document.createElement('div');
    tooltip.className = `rslider__tooltip rslider__tooltip--${layout}`;
    tooltip.innerText = this.values[index].toString(10);
    // Append
    handler.appendChild(tooltip);
  }

  private _elCreateHandler(id: number): void {
    // Create element
    const handler = document.createElement('div');
    handler.className = 'rslider__handler';
    handler.dataset.id = `${id}`;
    // Get handler coord
    const value = this.coords[id];
    const coord = value * this._getScaleFactor();
    // Add tooltip if enabled
    if (this.options.tooltip) this._addTooltip(handler, id);
    // Set handler position
    if (this.options.isHorizontal) handler.style.left = `${coord}%`;
    else handler.style.bottom = `${coord}%`;
    // Append
    this.UI.slider.appendChild(handler);
    // Save to this
    this.handlers.push(handler);
  }

  public render() {
    if (this.container == null) {
      throw new Error('There is no element matching provided selector.');
    }
    const { handlerCount } = this.modelOptions;
    // Create & append slider element
    this._elCreateSlider();
    // Create & append track element
    this._elCreateTrack();
    // Create & append handler elements
    for (let i = 0; i < handlerCount; i += 1) {
      this._elCreateHandler(i);
    }
    // Create & append progress element
    if (this.options.progress) {
      this._elCreateProgress();
    }

    return this.UI.slider;
  }

  private _configure(o: ViewOptions) {
    const { isHorizontal, handlerRadius, tooltip, progress } = o;

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

    if (typeof progress === 'boolean') {
      // Set value
      this.options.progress = progress;
    } else if (this.options.progress === undefined) {
      this.options.progress = false;
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
    // Set config
    if (o) return this._configure(o);
    // Get config
    return this.options;
  }

  public setModelOptions(o: ModelOptions) {
    return (this.modelOptions = o);
  }

  public setValues(v: number[]) {
    // Set handler values
    this.values = v;
    // Set handler coordinates
    this._setCoords(v);

    return this.values;
  }

  public notify() {
    this.presenter.update(this);
  }
}
