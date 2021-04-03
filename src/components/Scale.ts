import { boundMethod } from 'autobind-decorator';

import Subject from './Subject';
import { TScale, TSliderOptions, TScaleElements, TModelOptions } from './types';

class Scale extends Subject implements TScale {
  private markValues: number[] = [];

  private stepCountLimit: number = 10;

  private options: TSliderOptions;

  private UI: TScaleElements = {
    slider: null,
    scale: document.createElement('ul'),
    marks: [],
  };

  constructor(slider: HTMLElement, options: TSliderOptions) {
    super();

    this.UI.slider = slider;
    this.options = options;
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

  public setConfig(newOptions: TModelOptions): void {
    // Overwrite current config, can recieve partial config object
    this.options = { ...this.options, ...newOptions };

    this.populateScale();
  }

  private calcScaleStep(): number {
    const { minValue, maxValue, stepSize } = this.options;
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

    const { minValue, maxValue, isHorizontal, handlerRadius } = this.options;
    const scaleRange: number = Math.abs(maxValue - minValue);
    const scaleStepSize: number = this.calcScaleStep();
    const stepCount: number = Math.abs(scaleRange / scaleStepSize);

    const scaleRect = this.UI.slider.getBoundingClientRect();
    const { top, right, bottom, left } = scaleRect;
    const scaleElementLength = isHorizontal ? right - left : bottom - top;
    const handlerElementPercentRadius = (handlerRadius / scaleElementLength) * 100;
    const scalePercentLength = 100 - 2 * handlerElementPercentRadius;

    let i = 0;
    let value = minValue;

    while (i <= stepCount) {
      const scaleStepPosition: number =
        handlerElementPercentRadius +
        Math.abs(scaleStepSize / scaleRange) * i * scalePercentLength;

      this.createScaleMark(value, scaleStepPosition);

      value += scaleStepSize;
      i += 1;
    }

    return this.UI.scale;
  }

  @boundMethod
  private onClick(e: MouseEvent) {
    const target = <HTMLLIElement>e.target;

    if (!target.classList.contains('rscale__mark')) return;

    const value = parseInt(target.textContent, 10);

    this.notifyObservers(value);
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
