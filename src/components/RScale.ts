import { boundMethod } from 'autobind-decorator';

import { ModelOptions, Scale, ScaleElements, SliderOptions } from './interfaces';
import RSubject from './RSubject';

class RScale extends RSubject implements Scale {
  private markValues: number[] = [];

  private stepCountLimit: number = 10;

  private options: SliderOptions;

  private UI: ScaleElements = {
    container: null,
    scale: document.createElement('ul'),
    marks: [],
  };

  constructor(container: HTMLElement, options: SliderOptions) {
    super();

    this.UI.container = container;
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

  public setConfig(newOptions: ModelOptions): void {
    // Overwrite current config, can recieve partial config object
    this.options = { ...this.options, ...newOptions };

    this.populateScale();
  }

  private calcScaleStep(): number {
    const { minValue, maxValue, stepSize } = this.options;
    const stepNumber = Math.abs((maxValue - minValue) / stepSize);

    if (stepNumber > this.stepCountLimit) {
      // More steps than scale can hold
      const step = stepSize * Math.ceil(stepNumber / this.stepCountLimit);

      return maxValue > minValue ? step : -step;
    }

    return maxValue > minValue ? stepSize : -stepSize;
  }

  private populateScale(): HTMLUListElement {
    this.UI.scale.textContent = '';

    const { minValue, maxValue } = this.options;
    const scaleLength: number = Math.abs(maxValue - minValue);
    const scaleStepSize: number = this.calcScaleStep();
    const stepNumber: number = Math.abs(scaleLength / scaleStepSize);

    let i = 0;
    let value = minValue;

    while (i <= stepNumber) {
      const mark = document.createElement('li');
      mark.className = 'rscale__mark';
      mark.textContent = value.toString(10);
      this.UI.scale.appendChild(mark);

      this.UI.marks.push(mark);
      this.markValues.push(value);

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

export default RScale;
