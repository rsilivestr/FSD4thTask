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

  constructor(container: HTMLElement, o: SliderOptions) {
    super();

    this.UI.container = container;
    this.options = o;
    this._render();
  }

  public getElement(): HTMLUListElement {
    return this.UI.scale;
  }

  public toggleLayout(layout: 'horizontal' | 'vertical'): void {
    this.UI.scale.classList.remove('rscale--layout_horizontal');
    this.UI.scale.classList.remove('rscale--layout_vertical');

    this.UI.scale.classList.add(`rscale--layout_${layout}`);
  }

  public setConfig(o: ModelOptions): void {
    this.options = o;

    this._populateScale();
  }

  private _calcScaleStep(): number {
    const { minValue, maxValue, stepSize } = this.options;
    const stepNumber = Math.abs((maxValue - minValue) / stepSize);

    if (stepNumber > this.stepCountLimit) {
      // More steps than scale can hold
      const step = stepSize * Math.ceil(stepNumber / this.stepCountLimit);

      return maxValue > minValue ? step : -step;
    }

    return maxValue > minValue ? stepSize : -stepSize;
  }

  private _populateScale(): HTMLUListElement {
    this.UI.scale.textContent = '';

    const { minValue, maxValue } = this.options;
    const scaleLength: number = Math.abs(maxValue - minValue);
    const scaleStepSize: number = this._calcScaleStep();
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

  private _onClick(e: MouseEvent) {
    const target = <HTMLLIElement>e.target;

    if (target.classList.contains('rscale__mark')) {
      const value = parseInt(target.textContent, 10);

      // Get closest handler index
      // const index = this._getClosestHandlerIndex(value);

      this.notifyObservers(value);
    }
  }

  private _render() {
    const { isHorizontal } = this.options;
    const layout = isHorizontal ? 'horizontal' : 'vertical';
    this.UI.scale.className = `rslider__scale rscale rscale--layout_${layout}`;

    this._populateScale();

    this.UI.scale.addEventListener('click', (e) => this._onClick(e));

    return this.UI.scale;
  }
}

export default RScale;
