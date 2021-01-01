import Scale from './_interface/Scale';
import SliderOptions from './_interface/SliderOptions';
import RSubject from './_subject';

export default class RScale extends RSubject implements Scale {
  markValues: number[] = [];
  maxScaleSteps: number = 10;
  options: SliderOptions;
  UI: {
    container: HTMLElement;
    scale: HTMLElement;
    marks: HTMLElement[];
  } = {
    container: null,
    scale: document.createElement('div'),
    marks: [],
  };

  constructor(container: HTMLElement, o: SliderOptions) {
    super();

    this.UI.container = container;
    this.options = o;
    this._render();
  }

  public notifyObservers: (index: number, value: number) => void = (index, value) => {
    this.observers.forEach((o) => o(index, value));
  };

  public getElement(): HTMLElement {
    return this.UI.scale;
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
      mark.className = 'rslider-scale__mark';
      mark.innerText = value.toString(10);
      this.UI.scale.appendChild(mark);

      this.UI.marks.push(mark);
      this.markValues.push(value);

      value += scaleStepSize;
      i += 1;
    }

    if (this.options.handlerCount === 1) {
      this._addClickListener();
    }

    return this.UI.scale;
  }

  private _addClickListener() {
    this.UI.scale.addEventListener('click', (e) => {
      const target = <HTMLElement>e.target;

      if (target.classList.contains('rslider-scale__mark')) {
        const value = parseInt(target.textContent, 10);
        this.notifyObservers(0, value);
      }
    });
  }

  private _render() {
    const { isHorizontal } = this.options;
    const layout = isHorizontal ? 'horizontal' : 'vertical';
    this.UI.scale.className = `rslider-scale rslider-scale--layout_${layout}`;

    this._populateScale();

    const slider = this.UI.container.querySelector('.rslider');
    slider.insertAdjacentElement('afterend', this.UI.scale);

    return this.UI.scale;
  }
}
