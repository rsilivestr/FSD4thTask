import { boundMethod } from 'autobind-decorator';

import Subject from '@/components/Subject';

import { TScale, TScaleElements } from './types';
import { TSliderOptions } from '../types';

class Scale extends Subject implements TScale {
  private markValues: number[] = [];

  private stepCountLimit: number = 10;

  private options!: Partial<TSliderOptions>;

  private UI!: TScaleElements;

  constructor(slider: HTMLElement, options: Partial<TSliderOptions>) {
    super();

    this.init(slider, options);

    this.render();
  }

  public getElement(): HTMLUListElement {
    return this.UI.scale;
  }

  public toggleLayout(layout: 'horizontal' | 'vertical'): void {
    this.UI.scale.classList.remove('rscale--layout_horizontal');
    this.UI.scale.classList.remove('rscale--layout_vertical');

    this.UI.scale.classList.add(`rscale--layout_${layout}`);
  }

  public setConfig(newOptions: Partial<TSliderOptions>): void {
    this.options = { ...this.options, ...newOptions };

    this.populateScale();
  }

  private calcScaleStep(): number {
    const { minValue, maxValue, stepSize } = this.options;

    if (minValue === undefined || maxValue === undefined || stepSize === undefined)
      return NaN;

    const stepCount = Math.abs((maxValue - minValue) / stepSize);

    if (stepCount > this.stepCountLimit) {
      // More steps than scale can hold
      const step = stepSize * Math.ceil(stepCount / this.stepCountLimit);

      return maxValue > minValue ? step : -step;
    }

    return maxValue > minValue ? stepSize : -stepSize;
  }

  private createScaleMark(value: number, position: number): HTMLLIElement {
    const mark = document.createElement('li');
    mark.className = 'rscale__mark';
    mark.textContent = value.toString(10);
    if (this.options.isHorizontal) mark.style.left = `${position}%`;
    else mark.style.bottom = `${position}%`;

    this.UI.scale.appendChild(mark);

    this.UI.marks.push(mark);
    this.markValues.push(value);

    return mark;
  }

  private populateScale(): HTMLUListElement {
    this.UI.scale.textContent = '';

    const {
      minValue = 0,
      maxValue = 100,
      isHorizontal = true,
      handlerRadius = 8,
    } = this.options;

    const scaleRange: number = Math.abs(maxValue - minValue);
    const scaleStepSize: number = this.calcScaleStep();
    const isLastStepFull: boolean = !(scaleRange % scaleStepSize);
    const fullStepCount: number = Math.floor(Math.abs(scaleRange / scaleStepSize));
    const stepCount: number = isLastStepFull ? fullStepCount : fullStepCount + 1;

    const scaleRect = this.UI.slider.getBoundingClientRect();
    const { top, right, bottom, left } = scaleRect;
    const scaleElementLength = isHorizontal ? right - left : bottom - top;
    const handlerElementPercentRadius = (handlerRadius / scaleElementLength) * 100;
    const scalePercentLength = 100 - 2 * handlerElementPercentRadius;

    const directionMod = minValue > maxValue ? -1 : 1;

    Array(stepCount + 1 || 0)
      .fill(null)
      .forEach((step, index) => {
        const stepPosition: number =
          handlerElementPercentRadius +
          Math.abs(scaleStepSize / scaleRange) * index * scalePercentLength;
        const stepValue = minValue + scaleStepSize * index;

        const stepExceedsMax = stepValue * directionMod >= maxValue * directionMod;
        if (!stepExceedsMax && 100 - stepPosition < 10) return;
        const markValue = stepExceedsMax ? maxValue : stepValue;
        const maxPosition = scalePercentLength + handlerElementPercentRadius;
        const markPosition = stepExceedsMax ? maxPosition : stepPosition;
        this.createScaleMark(markValue, markPosition);
      });

    return this.UI.scale;
  }

  @boundMethod
  private onClick(e: MouseEvent) {
    const target = <HTMLLIElement>e.target;

    if (!target.classList.contains('rscale__mark')) return;

    const value = parseInt(<string>target.textContent, 10);

    this.notifyObservers(value);
  }

  private init(slider: HTMLElement, options: Partial<TSliderOptions>) {
    this.UI = {
      slider,
      scale: document.createElement('ul'),
      marks: [],
    };

    this.options = options;
  }

  private render() {
    const { isHorizontal } = this.options;
    const layout = isHorizontal ? 'horizontal' : 'vertical';
    this.UI.scale.className = `rslider__scale rscale rscale--layout_${layout}`;

    this.populateScale();

    this.UI.scale.addEventListener('click', this.onClick);

    return this.UI.scale;
  }
}

export default Scale;
