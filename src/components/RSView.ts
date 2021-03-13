import { boundMethod } from 'autobind-decorator';
import {
  Handler,
  HandlerOptions,
  ModelOptions,
  ProgressCoords,
  SliderOptions,
  View,
  ViewChildren,
  ViewElements,
  ViewOptions,
} from './interfaces';
import RSProgress from './RSProgress';
import RSHandler from './RSHandler';
import RScale from './RScale';
import RSubject from './RSubject';
import RSTrack from './RSTrack';

class RSView extends RSubject implements View {
  private children: ViewChildren = {
    handlers: [],
    progress: null,
    scale: null,
    track: null,
  };

  private container: HTMLElement;

  private grabOffset: number = 0;

  private modelOptions: ModelOptions;

  private options: ViewOptions = {};

  private UI: ViewElements = {
    activeHandler: null,
    progress: null,
    scale: null,
    slider: null,
    track: null,
  };

  private values: number[] = [];

  constructor(container: HTMLElement, o: SliderOptions = {}) {
    super();

    this.container = container;

    this._init(o);
  }

  public setValues(values: number[]): void {
    this.values = values;

    this._update();
  }

  public getConfig(): ViewOptions {
    return this.options;
  }

  public setConfig(o: ViewOptions) {
    return this._configure(o);
  }

  public setModelOptions(o: SliderOptions): ModelOptions {
    const { minValue, maxValue, stepSize, handlerCount, allowReversedValues } = o;

    if (this.modelOptions) {
      const mo = this.modelOptions;
      this.modelOptions.allowReversedValues = allowReversedValues;

      // Re-render on options change:
      if (minValue !== mo.minValue || maxValue !== mo.maxValue) {
        this.modelOptions.minValue = minValue;
        this.modelOptions.maxValue = maxValue;

        this.children.scale.setConfig(o);
        this._updateHandlers();
        if (this.options.showProgress) {
          this._updateProgress();
        }
      }

      if (stepSize !== mo.stepSize) {
        this.modelOptions.stepSize = stepSize;

        this.children.scale.setConfig(o);
      }

      if (handlerCount !== mo.handlerCount) {
        this.modelOptions.handlerCount = handlerCount;

        if (handlerCount > 2) {
          this._toggleProgress(false);
        }

        this._createHandlers();
      }
    } else {
      // First time
      this.modelOptions = {
        minValue,
        maxValue,
        stepSize,
        handlerCount,
        allowReversedValues,
      };
    }

    return this.modelOptions;
  }

  public onScaleClick(value: number): void {
    const index = this._getClosestHandlerIndex(value);

    this.notifyObservers(index, value);
  }

  // Invoked on Track mousedown (Observer)
  public onTrackMousedown(e: MouseEvent): void {
    const coord = this._getRelativeCoord(e);
    const value = this._coordToValue(coord);

    const index = this._getClosestHandlerIndex(value);
    const handler = this.children.handlers[index].getElement();

    this._grab(e, handler);

    this.grabOffset = 0;

    this._moveHandler(coord);
  }

  private _update(): void {
    this._updateHandlers();

    if (this.options.showProgress) {
      this._updateProgress();
    }
  }

  private _addScale(o: ModelOptions) {
    if (!this.children.scale) {
      const scale = new RScale(this.container, o);
      this.children.scale = scale;
    }

    const scaleElement = this.children.scale.getElement();
    this.UI.scale = scaleElement;
    this.UI.slider.insertAdjacentElement('beforeend', scaleElement);

    // Send Scale clicks to model through presenter, then model will update view
    this.children.scale.addObserver(this.onScaleClick.bind(this));
  }

  private _toggleScale(showScale: boolean) {
    // If slider is not rendered yet
    if (!this.UI.slider) {
      return;
    }

    if (showScale && !this.UI.scale) {
      this._addScale({ ...this.modelOptions, ...this.options });
    } else if (!showScale && this.UI.scale) {
      this.UI.scale.remove();
      this.UI.scale = null;
      this.children.scale = null;
    }
  }

  private _init(o: SliderOptions): void {
    this._configure(o);

    this.setModelOptions(o);

    this._render();
  }

  private _render() {
    if (this.container == null) {
      throw new Error('There is no element matching provided selector.');
    }

    this.UI.slider = this._elCreateSlider();
    this.UI.track = this._createTrack();

    this._createHandlers();

    if (this.options.showProgress) {
      this._createProgress();
    }

    if (this.options.showScale) {
      this._addScale({ ...this.modelOptions, ...this.options });
    }

    return this.UI.slider;
  }

  private _createHandlers() {
    if (this.children.handlers.length > 0) {
      this.children.handlers.forEach((h) => h.getElement().remove());

      this.children.handlers = [];
    }

    const { handlerCount } = this.modelOptions;

    for (let i = 0; i < handlerCount; i += 1) {
      const handler = this._addHandler(i);
      this.children.handlers[i] = handler;
    }
  }

  private _correctHandlerCoord(): number {
    const { trackLength } = this.children.track.getRect();
    const r = this.options.handlerRadius;

    return 1 - (2 * r) / trackLength;
  }

  private _coordToValue(coord: number): number {
    const { minValue, maxValue } = this.modelOptions;

    return minValue + (maxValue - minValue) * (coord / 100);
  }

  private _valueToCoord(value: number): number {
    const { minValue, maxValue } = this.modelOptions;

    return ((value - minValue) / (maxValue - minValue)) * 100;
  }

  private _elCreateSlider(): HTMLElement {
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';

    const slider = document.createElement('div');
    slider.className = `rslider rslider--layout_${layout}`;

    this.container.appendChild(slider);

    // Prevent dragstart
    slider.addEventListener('dragstart', (e) => e.preventDefault());

    return slider;
  }

  private _createTrack(): HTMLElement {
    this.children.track = new RSTrack(this.options.isHorizontal);

    const trackElement = this.children.track.getElement();

    this.UI.slider.appendChild(trackElement);

    this.children.track.addObserver(this.onTrackMousedown.bind(this));

    return trackElement;
  }

  private _calcProgressCoords(): ProgressCoords {
    const { handlerCount } = this.modelOptions;
    const single = handlerCount === 1;

    const coord1 = single ? 0 : this._valueToCoord(this.values[0]);
    const coord2 = single
      ? this._valueToCoord(this.values[0])
      : this._valueToCoord(this.values[1]);

    return [coord1, coord2];
  }

  private _createProgress() {
    const coords = this._calcProgressCoords();
    const { isHorizontal } = this.options;

    this.children.progress = new RSProgress(coords, isHorizontal);

    this.UI.progress = this.children.progress.getElement();

    this.UI.track.appendChild(this.UI.progress);
  }

  private _updateProgress(): void {
    const coords = this._calcProgressCoords();

    this.children.progress.setCoords(coords);
  }

  private _toggleProgress(progress: boolean): void {
    // If slider is not rendered yet
    if (!this.UI.slider) {
      return;
    }

    if (this.modelOptions.handlerCount > 2) {
      this.options.showProgress = false;

      if (this.UI.progress) {
        this.UI.progress.remove();
        this.UI.progress = null;
        this.children.progress = null;
      }

      return;
    }

    if (progress && !this.UI.progress) {
      this._createProgress();
      this._updateProgress();
    } else if (!progress && this.UI.progress) {
      this.UI.progress.remove();
      this.UI.progress = null;
      this.children.progress = null;
    }
  }

  private _addHandler(index: number) {
    const options: HandlerOptions = {
      id: index,
      layout: this.options.isHorizontal ? 'horizontal' : 'vertical',
      tooltip: this.options.showTooltip,
      value: 0,
    };

    const handler: Handler = new RSHandler(options);
    const handlerElement = handler.getElement();

    this.UI.slider.appendChild(handlerElement);

    handlerElement.addEventListener('mousedown', (e) => this._grab(e, handlerElement));

    return handler;
  }

  private _setGrabbedOffset(e: MouseEvent): void {
    const { isHorizontal, handlerRadius } = this.options;

    const handlerRect = this.UI.activeHandler.getBoundingClientRect();
    const handlerCoord = isHorizontal ? handlerRect.left : handlerRect.bottom;
    const clickCoord = isHorizontal ? e.clientX : e.clientY;

    this.grabOffset = handlerRadius + handlerCoord - clickCoord;
  }

  private _grab(e: MouseEvent, handler: HTMLElement): void {
    e.preventDefault();

    // Set grabbed handler
    this.UI.activeHandler = handler;

    this._setGrabbedOffset(e);

    // Add listeners
    document.body.addEventListener('mousemove', this._drag);
    document.body.addEventListener('mouseup', this._release);
    document.body.addEventListener('mouseleave', this._release);
  }

  private _updateHandlers() {
    this.children.handlers.forEach((handler, index) => {
      const value = this.values[index];

      const coord = this._valueToCoord(value) * this._correctHandlerCoord();
      // Update handler position and value
      handler.setPosition(coord);
      handler.updateValue(value);
    });
  }

  private _getRelativeCoord(e: MouseEvent): number {
    const { isHorizontal } = this.options;
    const { trackMin, trackLength } = this.children.track.getRect();

    const diff = isHorizontal ? e.clientX - trackMin : trackMin - e.clientY;
    const coord = ((diff + this.grabOffset) / trackLength) * 100;

    return coord;
  }

  private _getClosestHandlerIndex(goal: number): number {
    const closest = this.values.reduce((prev, curr) =>
      Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    );

    const index = this.values.indexOf(closest);

    return index;
  }

  private _moveHandler(coord: number) {
    const value = this._coordToValue(coord);

    // Update model through presenter
    const index = parseInt(this.UI.activeHandler.dataset.id, 10);
    this.notifyObservers(index, value);

    this._updateHandlers();

    if (this.options.showProgress) {
      this._updateProgress();
    }
  }

  @boundMethod
  private _drag(e: MouseEvent): void {
    const coord = this._getRelativeCoord(e);

    this._moveHandler(coord);
  }

  @boundMethod
  private _release(): void {
    this.UI.activeHandler = null;

    document.body.removeEventListener('mousemove', this._drag);
    document.body.removeEventListener('mouseup', this._release);
  }

  private _updateOrientation(horizontal = true) {
    if (!this.UI.slider) return;

    if (horizontal) {
      this.UI.slider.classList.remove('rslider--layout_vertical');
      this.UI.slider.classList.add('rslider--layout_horizontal');
    } else {
      this.UI.slider.classList.add('rslider--layout_vertical');
      this.UI.slider.classList.remove('rslider--layout_horizontal');
    }

    this.children.track.toggleLayout(this.options.isHorizontal);

    if (this.options.showProgress) {
      this.children.progress.toggleHorizontal(this.options.isHorizontal);

      this._updateProgress();
    }

    if (this.UI.scale) {
      const layout = horizontal ? 'horizontal' : 'vertical';
      this.children.scale.toggleLayout(layout);
    }

    const layout = horizontal ? 'horizontal' : 'vertical';
    this.children.handlers.forEach((h) => h.toggleLayout(layout));
  }

  private _configure(o: ViewOptions) {
    const { isHorizontal, handlerRadius, showProgress, showScale, showTooltip } = o;

    if (typeof isHorizontal === 'boolean') {
      this.options.isHorizontal = isHorizontal;

      this._updateOrientation(this.options.isHorizontal);
    } else if (this.options.isHorizontal === undefined) {
      this.options.isHorizontal = true;

      this._updateOrientation(this.options.isHorizontal);
    }

    if (typeof handlerRadius === 'number' && !Number.isNaN(handlerRadius)) {
      this.options.handlerRadius = handlerRadius;
    } else if (this.options.handlerRadius === undefined) {
      this.options.handlerRadius = 8;
    }

    if (typeof showProgress === 'boolean') {
      this.options.showProgress = showProgress;
      this._toggleProgress(this.options.showProgress);
    } else if (this.options.showProgress === undefined) {
      this.options.showProgress = false;
      this._toggleProgress(this.options.showProgress);
    }

    if (typeof showScale === 'boolean') {
      this.options.showScale = showScale;

      this._toggleScale(this.options.showScale);
    } else if (this.options.showScale === undefined) {
      this.options.showScale = true;

      this._toggleScale(this.options.showScale);
    }

    if (this.children.scale) {
      this.children.scale.setConfig({ ...this.options, ...this.modelOptions });
    }

    if (typeof showTooltip === 'boolean') {
      this.options.showTooltip = showTooltip;
    } else if (this.options.showTooltip === undefined) {
      this.options.showTooltip = true;
    }

    this.children.handlers.forEach((h) => h.toggleTooltip(this.options.showTooltip));

    return this.options;
  }
}

export default RSView;
