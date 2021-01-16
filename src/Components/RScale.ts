import { Subject, ModelOptions, SliderOptions } from './interfaces';
import RSubject from './RSubject';

interface Scale extends Subject {
  getElement: () => HTMLElement;
  toggleLayout: (layout: 'horizontal' | 'vertical') => void;
  setConfig: (o: ModelOptions) => void;
  setValues: (v: number[]) => void;
}

type ScaleElements = {
  container: HTMLElement;
  scale: HTMLElement;
  marks: HTMLElement[];
};

class RScale extends RSubject implements Scale {
  private markValues: number[] = [];

  private maxScaleSteps: number = 10;

  private options: SliderOptions;

  private UI: ScaleElements = {
    container: null,
    scale: document.createElement('ul'),
    marks: [],
  };

  private values: number[];

  constructor(container: HTMLElement, o: SliderOptions) {
    super();

    this.UI.container = container;
    this.options = o;
    this._render();
  }

  public getElement(): HTMLElement {
    return this.UI.scale;
  }

  public toggleLayout(layout: 'horizontal' | 'vertical') {
    this.UI.scale.classList.remove('rscale--layout_horizontal');
    this.UI.scale.classList.remove('rscale--layout_vertical');

    this.UI.scale.classList.add(`rscale--layout_${layout}`);
  }

  public setConfig(o: ModelOptions): void {
    this.options = o;

    this._populateScale();
  }

  public setValues(v: number[]) {
    this.values = v;
  }

  private _calcScaleStep(): number {
    const { minValue, maxValue, stepSize } = this.options;
    const stepNumber = (maxValue - minValue) / stepSize;

    if (stepNumber > this.maxScaleSteps) {
      // More steps than scale can hold
      return stepSize * Math.ceil(stepNumber / this.maxScaleSteps);
    }

    return stepSize;
  }

  private _populateScale(): HTMLElement {
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
      mark.innerText = value.toString(10);
      this.UI.scale.appendChild(mark);

      this.UI.marks.push(mark);
      this.markValues.push(value);

      value += scaleStepSize;
      i += 1;
    }

    return this.UI.scale;
  }

  private _getClosestHandlerIndex(goal: number): number {
    const closest = this.values.reduce((prev, curr) =>
      Math.abs(curr - goal) < Math.abs(prev - goal) ? curr : prev
    );

    const index = this.values.indexOf(closest);

    return index;
  }

  private _onClick(e: MouseEvent) {
    const target = <HTMLLIElement>e.target;

    if (target.classList.contains('rscale__mark')) {
      const value = parseInt(target.textContent, 10);

      // Get closest handler index
      const index = this._getClosestHandlerIndex(value);

      this.notifyObservers(index, value);
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
