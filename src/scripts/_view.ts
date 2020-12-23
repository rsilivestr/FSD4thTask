import Handler from './_interface/Handler';
import HandlerOptions from './_interface/HandlerOptions';
import ModelOptions from './_interface/ModelOptions';
import Presenter from './_interface/Presenter';
import RSHandler from './_handler';
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
  public handlers: Handler[] = [];
  public values: number[] = [];
  public grabbed: null | HTMLElement = null;

  constructor(el: HTMLElement, o: SliderOptions) {
    // Save root element
    this.container = el;
    // Set options
    this._configure(o);
  }

  private _getRect() {
    const rect = this.UI.track.getBoundingClientRect();

    const { isHorizontal } = this.options;

    return {
      sliderLength: isHorizontal ? rect.right - rect.left : rect.bottom - rect.top,
      minCoord: isHorizontal ? rect.left : rect.bottom,
      maxCoord: isHorizontal ? rect.right : rect.top,
    };
  }

  private _correctHandlerCoord(): number {
    // Get track length
    const { sliderLength } = this._getRect();
    const r = this.options.handlerRadius;

    return 1 - (2 * r) / sliderLength;
  }

  private _coordToValue(coord: number): number {
    const { minValue, maxValue } = this.modelOptions;
    // const factor = this._correctHandlerCoord() * 100;

    return minValue + (maxValue - minValue) * (coord / 100);
  }

  private _valueToCoord(value: number): number {
    const { minValue, maxValue } = this.modelOptions;

    return ((value - minValue) / (maxValue - minValue)) * 100;
  }

  private _elCreateSlider(): void {
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';
    // Create element
    this.UI.slider = document.createElement('div');
    this.UI.slider.className = `rslider rslider--layout_${layout}`;
    // Append
    this.container.appendChild(this.UI.slider);
    // Prevent dragstart
    this.UI.slider.addEventListener('dragstart', (e) => {
      e.preventDefault();
    });
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
    // For single handler
    const coordOne = this._valueToCoord(this.values[0]);
    let min = 0;
    let max = 100 - coordOne;

    if (this.modelOptions.handlerCount === 2) {
      const coordTwo = this._valueToCoord(this.values[1]);
      [min, max] = [coordOne, coordTwo];
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
  }

  private _addHandler(index: number) {
    // Initialize options
    const options: HandlerOptions = {
      id: index,
      layout: this.options.isHorizontal ? 'horizontal' : 'vertical',
      tooltip: this.options.tooltip,
      value: 0,
    };
    // Create handler instance
    const handler: Handler = new RSHandler(options);
    // Append to slider
    const handlerElement = handler.getElement();
    this.UI.slider.appendChild(handlerElement);
    // Add event listener
    handlerElement.addEventListener('mousedown', () => this._grab(handlerElement));

    return handler;
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
      const handler = this._addHandler(i);
      this.handlers[i] = handler;
    }
    // Create & append progress element
    if (this.options.progress) {
      this._elCreateProgress();
    }

    return this.UI.slider;
  }

  private _grab(handler: HTMLElement): void {
    // Set grabbed handler
    this.grabbed = handler;
    // Add listeners
    document.body.addEventListener('mousemove', this._boundDrag);
    document.body.addEventListener('mouseup', this._boundRelease);
  }

  private _updateHandlers() {
    this.handlers.forEach((handler, index) => {
      const value = this.values[index];
      const coord = this._valueToCoord(value) * this._correctHandlerCoord();
      // Update handler position and value
      handler.setPosition(coord);
      handler.updateValue(value);
    });
  }

  private _drag(e: MouseEvent): void {
    const { minCoord, sliderLength } = this._getRect();
    // Get relative coord in px
    const diff = e.clientX - minCoord;
    // Get relative coordinate in percent
    let coord = (diff / sliderLength) * 100;
    if (coord < 0) coord = 0;
    if (coord > 100) coord = 100;

    // Update model through presenter
    const id = parseInt(this.grabbed.dataset.id, 10);
    this.presenter.moveHandler(id, coord);
    // Update handlers
    this._updateHandlers();
    // Update progress bar
    this._setProgress();
  }

  // Bind _drag method to this
  private _boundDrag: (e: MouseEvent) => void = this._drag.bind(this);

  private _release(): void {
    // Unset grabbed handler
    this.grabbed = null;
    // Remove listeners
    document.body.removeEventListener('mousemove', this._boundDrag);
    document.body.removeEventListener('mouseup', this._boundRelease);
  }

  // Bind _release method to this
  private _boundRelease: () => void = this._release.bind(this);

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

  public config(o?: ViewOptions) {
    // Set config
    if (o) return this._configure(o);
    // Get config
    return this.options;
  }

  public setModelOptions(o: ModelOptions) {
    return (this.modelOptions = o);
  }

  public notify() {
    // this.presenter.update(this);
  }

  // Observer
  public update(v: number[]) {
    // Set handler values
    this.values = v;
    // Move handlers
    this._updateHandlers();
    // Update progress
    this._setProgress();

    return this.values;
  }
}
