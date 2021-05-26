import { boundMethod } from 'autobind-decorator';

import Subject from '@/components/Subject';

import { TModelOptions, TSliderOptions, TSliderOptionsPartial } from '../types';
import {
  TView,
  TViewChildren,
  TViewOptions,
  TViewOptionsPartial,
  TViewElements,
  TProgressCoords,
  THandler,
  THandlerOptions,
} from './types';
import Handler from './Handler';
import Progress from './Progress';
import Scale from './Scale';
import Track from './Track';

class View extends Subject implements TView {
  private children: TViewChildren = {
    handlers: [],
    progress: null,
    scale: null,
    track: null,
  };

  private container: HTMLElement;

  private grabOffset: number = 0;

  private modelOptions!: TModelOptions;

  private options!: TViewOptions;

  private UI!: TViewElements;

  private values: number[] = [];

  constructor(container: HTMLElement, o: TSliderOptionsPartial & TModelOptions) {
    super();

    this.container = container;

    this.init(o);
  }

  public setValues(values: number[]): void {
    this.values = values;

    this.update();
  }

  public getConfig(): TViewOptions {
    return this.options;
  }

  public setConfig(o: TViewOptionsPartial) {
    this.configure(o);
  }

  public setModelOptions(o: TModelOptions): void {
    const {
      minValue,
      maxValue,
      stepSize,
      handlerCount,
      handlerInteraction,
      allowReversedValues,
    } = o;

    if (this.modelOptions) {
      const mo = this.modelOptions;
      this.modelOptions.allowReversedValues = allowReversedValues;

      const optionsWereChanged = minValue !== mo.minValue || maxValue !== mo.maxValue;
      if (optionsWereChanged) {
        this.modelOptions.minValue = minValue;
        this.modelOptions.maxValue = maxValue;

        if (this.children.scale) {
          this.children.scale.setConfig(o);
        }

        this.updateHandlers();

        if (this.options.showProgress) {
          this.updateProgress();
        }
      }

      if (stepSize !== mo.stepSize) {
        this.modelOptions.stepSize = stepSize;

        if (this.children.scale) {
          this.children.scale.setConfig(o);
        }
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
        handlerInteraction,
        allowReversedValues,
      };
    }
  }

  public onScaleClick(value: number): void {
    const index = this.getClosestHandlerIndex(value);

    this.notifyObservers(index, value);
  }

  @boundMethod
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

  private addScale(o: TSliderOptions) {
    if (!this.children.scale) {
      const scale = new Scale(this.UI.slider, o);
      this.children.scale = scale;
    }

    const scaleElement = this.children.scale.getElement();
    this.UI.scale = scaleElement;
    this.UI.slider.insertAdjacentElement('beforeend', scaleElement);

    this.children.scale.addObserver(this.onScaleClick.bind(this));
  }

  private toggleScale(showScale: boolean) {
    if (!this.UI) return;

    if (showScale && !this.UI.scale) {
      this.addScale({ ...this.modelOptions, ...this.options });
    } else if (!showScale && this.UI.scale) {
      this.UI.scale.remove();
      this.UI.scale = null;
      this.children.scale = null;
    }
  }

  private init(o: TSliderOptionsPartial & TModelOptions): void {
    this.configure(o);

    this.setModelOptions(o);

    this.render();
  }

  private render() {
    if (this.container === null) {
      throw new Error('There is no element matching provided selector.');
    }

    this.UI = {
      activeHandler: null,
      progress: null,
      scale: null,
      slider: this.createSlider(),
      track: this.createTrack(),
    };

    this.UI.slider.appendChild(this.UI.track);

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
    if (!this.children.track) return 0;

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

  private createSlider(): HTMLElement {
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

    this.children.track.addObserver(this.onTrackMousedown);

    return trackElement;
  }

  private calcProgressCoords(): TProgressCoords {
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
    if (!this.children.progress) return;

    const coords = this.calcProgressCoords();

    this.children.progress.setCoords(coords);
  }

  private toggleProgress(progress: boolean): void {
    if (!this.UI) return;

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
    const options: THandlerOptions = {
      id: index,
      layout: this.options.isHorizontal ? 'horizontal' : 'vertical',
      tooltip: this.options.showTooltip,
      value: 0,
    };

    const handler: THandler = new Handler(options);
    const handlerElement = handler.getElement();

    this.UI.slider.appendChild(handlerElement);

    handlerElement.addEventListener('mousedown', (e) => this.grab(e, handlerElement));

    return handler;
  }

  private setGrabbedOffset(e: MouseEvent): void {
    if (!this.UI.activeHandler) return;

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
    const { minValue, maxValue } = this.modelOptions;
    const sliderLength = maxValue - minValue;

    this.children.handlers.forEach((handler, index) => {
      const value = this.values[index];
      const coord = this.valueToCoord(value) * this.correctHandlerCoord();
      handler.setPosition(coord);
      handler.setZIndex(sliderLength, coord);
      handler.updateValue(value);
    });
  }

  private getRelativeCoord(e: MouseEvent): number {
    if (!this.children.track) return 0;

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

    if (!this.UI.activeHandler) return;

    // Update model through presenter
    const index = parseInt(this.UI.activeHandler.dataset.id || '0', 10);
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
    if (!this.UI) return;

    if (horizontal) {
      this.UI.slider.classList.remove('rslider--layout_vertical');
      this.UI.slider.classList.add('rslider--layout_horizontal');
    } else {
      this.UI.slider.classList.add('rslider--layout_vertical');
      this.UI.slider.classList.remove('rslider--layout_horizontal');
    }

    if (!this.children.track) return;
    this.children.track.toggleLayout(this.options.isHorizontal);

    if (this.options.showProgress && this.children.progress) {
      this.children.progress.toggleHorizontal(this.options.isHorizontal);

      this.updateProgress();
    }

    if (this.children.scale) {
      const layout = horizontal ? 'horizontal' : 'vertical';
      this.children.scale.toggleLayout(layout);
    }

    const layout = horizontal ? 'horizontal' : 'vertical';
    this.children.handlers.forEach((h) => h.toggleLayout(layout));
  }

  private configure(o: TViewOptionsPartial) {
    const { isHorizontal, handlerRadius, showProgress, showScale, showTooltip } = o;

    if (!this.options) this.options = <TViewOptions>{};

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
      this.options.handlerRadius = <number>handlerRadius;
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
