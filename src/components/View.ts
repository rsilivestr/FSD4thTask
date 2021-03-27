import { boundMethod } from 'autobind-decorator';

import Handler from './Handler';
import Progress from './Progress';
import Scale from './Scale';
import Subject from './Subject';
import Track from './Track';
import * as types from './types';

class View extends Subject implements types.View {
  private children: types.ViewChildren = {
    handlers: [],
    progress: null,
    scale: null,
    track: null,
  };

  private container: HTMLElement;

  private grabOffset: number = 0;

  private modelOptions: types.ModelOptions;

  private options: types.ViewOptions = {};

  private UI: types.ViewElements = {
    activeHandler: null,
    progress: null,
    scale: null,
    slider: null,
    track: null,
  };

  private values: number[] = [];

  constructor(container: HTMLElement, o: types.SliderOptions = {}) {
    super();

    this.container = container;

    this.init(o);
  }

  public setValues(values: number[]): void {
    this.values = values;

    this.update();
  }

  public getConfig(): types.ViewOptions {
    return this.options;
  }

  public setConfig(o: types.ViewOptions) {
    return this.configure(o);
  }

  public setModelOptions(o: types.SliderOptions): types.ModelOptions {
    const { minValue, maxValue, stepSize, handlerCount, allowReversedValues } = o;

    if (this.modelOptions) {
      const mo = this.modelOptions;
      this.modelOptions.allowReversedValues = allowReversedValues;

      const optionsWereChanged = minValue !== mo.minValue || maxValue !== mo.maxValue;
      if (optionsWereChanged) {
        this.modelOptions.minValue = minValue;
        this.modelOptions.maxValue = maxValue;

        this.children.scale.setConfig(o);
        this.updateHandlers();
        if (this.options.showProgress) {
          this.updateProgress();
        }
      }

      if (stepSize !== mo.stepSize) {
        this.modelOptions.stepSize = stepSize;

        this.children.scale.setConfig(o);
      }

      if (handlerCount !== mo.handlerCount) {
        this.modelOptions.handlerCount = handlerCount;

        if (handlerCount > 2) {
          this.toggleProgress(false);
        }

        this.createHandlers();
      }
    } else {
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
    const index = this.getClosestHandlerIndex(value);

    this.notifyObservers(index, value);
  }

  public onTrackMousedown(e: MouseEvent): void {
    const coord = this.getRelativeCoord(e);
    const value = this.coordToValue(coord);

    const index = this.getClosestHandlerIndex(value);
    const handler = this.children.handlers[index].getElement();

    this.grab(e, handler);

    this.grabOffset = 0;

    this.moveHandler(coord);
  }

  private update(): void {
    this.updateHandlers();

    if (this.options.showProgress) {
      this.updateProgress();
    }
  }

  private addScale(o: types.ModelOptions) {
    if (!this.children.scale) {
      const scale = new Scale(this.container, o);
      this.children.scale = scale;
    }

    const scaleElement = this.children.scale.getElement();
    this.UI.scale = scaleElement;
    this.UI.slider.insertAdjacentElement('beforeend', scaleElement);

    this.children.scale.addObserver(this.onScaleClick.bind(this));
  }

  private toggleScale(showScale: boolean) {
    if (!this.UI.slider) return;

    if (showScale && !this.UI.scale) {
      this.addScale({ ...this.modelOptions, ...this.options });
    } else if (!showScale && this.UI.scale) {
      this.UI.scale.remove();
      this.UI.scale = null;
      this.children.scale = null;
    }
  }

  private init(o: types.SliderOptions): void {
    this.configure(o);

    this.setModelOptions(o);

    this.render();
  }

  private render() {
    if (this.container === null) {
      throw new Error('There is no element matching provided selector.');
    }

    this.UI.slider = this.elCreateSlider();
    this.UI.track = this.createTrack();

    this.createHandlers();

    if (this.options.showProgress) {
      this.createProgress();
    }

    if (this.options.showScale) {
      this.addScale({ ...this.modelOptions, ...this.options });
    }

    return this.UI.slider;
  }

  private createHandlers() {
    if (this.children.handlers.length > 0) {
      this.children.handlers.forEach((h) => h.getElement().remove());

      this.children.handlers = [];
    }

    const { handlerCount } = this.modelOptions;

    for (let i = 0; i < handlerCount; i += 1) {
      const handler = this.addHandler(i);
      this.children.handlers[i] = handler;
    }
  }

  private correctHandlerCoord(): number {
    const { trackLength } = this.children.track.getRect();
    const r = this.options.handlerRadius;

    return 1 - (2 * r) / trackLength;
  }

  private coordToValue(coord: number): number {
    const { minValue, maxValue } = this.modelOptions;

    return minValue + (maxValue - minValue) * (coord / 100);
  }

  private valueToCoord(value: number): number {
    const { minValue, maxValue } = this.modelOptions;

    return ((value - minValue) / (maxValue - minValue)) * 100;
  }

  private elCreateSlider(): HTMLElement {
    const layout = this.options.isHorizontal ? 'horizontal' : 'vertical';

    const slider = document.createElement('div');
    slider.className = `rslider rslider--layout_${layout}`;

    this.container.appendChild(slider);

    // Prevent dragstart
    slider.addEventListener('dragstart', (e) => e.preventDefault());

    return slider;
  }

  private createTrack(): HTMLElement {
    this.children.track = new Track(this.options.isHorizontal);

    const trackElement = this.children.track.getElement();

    this.UI.slider.appendChild(trackElement);

    this.children.track.addObserver(this.onTrackMousedown.bind(this));

    return trackElement;
  }

  private calcProgressCoords(): types.ProgressCoords {
    const { handlerCount } = this.modelOptions;
    const single = handlerCount === 1;

    const coord1 = single ? 0 : this.valueToCoord(this.values[0]);
    const coord2 = single
      ? this.valueToCoord(this.values[0])
      : this.valueToCoord(this.values[1]);

    return [coord1, coord2];
  }

  private createProgress() {
    const coords = this.calcProgressCoords();
    const { isHorizontal } = this.options;

    this.children.progress = new Progress(coords, isHorizontal);

    this.UI.progress = this.children.progress.getElement();

    this.UI.track.appendChild(this.UI.progress);
  }

  private updateProgress(): void {
    const coords = this.calcProgressCoords();

    this.children.progress.setCoords(coords);
  }

  private toggleProgress(progress: boolean): void {
    if (!this.UI.slider) return;

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
      this.createProgress();
      this.updateProgress();
    } else if (!progress && this.UI.progress) {
      this.UI.progress.remove();
      this.UI.progress = null;
      this.children.progress = null;
    }
  }

  private addHandler(index: number) {
    const options: types.HandlerOptions = {
      id: index,
      layout: this.options.isHorizontal ? 'horizontal' : 'vertical',
      tooltip: this.options.showTooltip,
      value: 0,
    };

    const handler: types.Handler = new Handler(options);
    const handlerElement = handler.getElement();

    this.UI.slider.appendChild(handlerElement);

    handlerElement.addEventListener('mousedown', (e) => this.grab(e, handlerElement));

    return handler;
  }

  private setGrabbedOffset(e: MouseEvent): void {
    const { isHorizontal, handlerRadius } = this.options;

    const handlerRect = this.UI.activeHandler.getBoundingClientRect();
    const handlerCoord = isHorizontal ? handlerRect.left : handlerRect.bottom;
    const clickCoord = isHorizontal ? e.clientX : e.clientY;

    this.grabOffset = handlerRadius + handlerCoord - clickCoord;
  }

  private grab(e: MouseEvent, handler: HTMLElement): void {
    e.preventDefault();

    this.UI.activeHandler = handler;

    this.setGrabbedOffset(e);

    document.body.addEventListener('mousemove', this.drag);
    document.body.addEventListener('mouseup', this.release);
    document.body.addEventListener('mouseleave', this.release);
  }

  private updateHandlers() {
    this.children.handlers.forEach((handler, index) => {
      const value = this.values[index];
      const coord = this.valueToCoord(value) * this.correctHandlerCoord();
      handler.setPosition(coord);
      handler.updateValue(value);
    });
  }

  private getRelativeCoord(e: MouseEvent): number {
    const { isHorizontal } = this.options;
    const { trackMin, trackLength } = this.children.track.getRect();

    const diff = isHorizontal ? e.clientX - trackMin : trackMin - e.clientY;
    const coord = ((diff + this.grabOffset) / trackLength) * 100;

    return coord;
  }

  private getClosestHandlerIndex(goal: number): number {
    const closest = this.values.reduce((prev, curr) =>
      Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    );

    const index = this.values.indexOf(closest);

    return index;
  }

  private moveHandler(coord: number) {
    const value = this.coordToValue(coord);

    // Update model through presenter
    const index = parseInt(this.UI.activeHandler.dataset.id, 10);
    this.notifyObservers(index, value);

    this.updateHandlers();

    if (this.options.showProgress) {
      this.updateProgress();
    }
  }

  @boundMethod
  private drag(e: MouseEvent): void {
    const coord = this.getRelativeCoord(e);

    this.moveHandler(coord);
  }

  @boundMethod
  private release(): void {
    this.UI.activeHandler = null;

    document.body.removeEventListener('mousemove', this.drag);
    document.body.removeEventListener('mouseup', this.release);
  }

  private updateOrientation(horizontal = true) {
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

      this.updateProgress();
    }

    if (this.UI.scale) {
      const layout = horizontal ? 'horizontal' : 'vertical';
      this.children.scale.toggleLayout(layout);
    }

    const layout = horizontal ? 'horizontal' : 'vertical';
    this.children.handlers.forEach((h) => h.toggleLayout(layout));
  }

  private configure(o: types.ViewOptions) {
    const { isHorizontal, handlerRadius, showProgress, showScale, showTooltip } = o;

    if (typeof isHorizontal === 'boolean') {
      this.options.isHorizontal = isHorizontal;

      this.updateOrientation(this.options.isHorizontal);
    } else if (this.options.isHorizontal === undefined) {
      this.options.isHorizontal = true;

      this.updateOrientation(this.options.isHorizontal);
    }

    const isHandlerRadiusValid =
      typeof handlerRadius === 'number' && !Number.isNaN(handlerRadius);
    if (isHandlerRadiusValid) {
      this.options.handlerRadius = handlerRadius;
    } else if (this.options.handlerRadius === undefined) {
      this.options.handlerRadius = 8;
    }

    if (typeof showProgress === 'boolean') {
      this.options.showProgress = showProgress;
      this.toggleProgress(this.options.showProgress);
    } else if (this.options.showProgress === undefined) {
      this.options.showProgress = false;
      this.toggleProgress(this.options.showProgress);
    }

    if (typeof showScale === 'boolean') {
      this.options.showScale = showScale;

      this.toggleScale(this.options.showScale);
    } else if (this.options.showScale === undefined) {
      this.options.showScale = true;

      this.toggleScale(this.options.showScale);
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

export default View;
