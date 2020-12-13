import { Observer } from './interfaces';
import { Slider } from './rslider';

export interface Scale extends Observer {
  slider: Slider;
  scaleMarks: HTMLElement[];
  markValues: number[];

  update(): void;
}

export default class RScale implements Scale {
  slider: Slider;
  scale: HTMLElement = document.createElement('ul');
  scaleMarks: HTMLElement[] = [];
  markValues: number[] = [];
  scaleStep: number;
  // 10 steps = 11 marks
  maxScaleSteps: number = 10;

  constructor(slider: Slider) {
    this.slider = slider;
    this._init();
  }

  private _init() {
    this.slider.model.addObserver(this);
    this._render();
  }

  private _calcScaleStep(): number {
    const { minValue, maxValue, stepSize } = this.slider.getOptions();
    const stepNumber: number = (maxValue - minValue) / stepSize;

    if (stepNumber > this.maxScaleSteps) {
      // More steps than scale can hold
      return stepSize * Math.ceil(stepNumber / this.maxScaleSteps);
    }

    return stepSize;
  }

  private _populateScale(scale: HTMLElement): HTMLElement {
    this.scale.textContent = '';
    this.scaleMarks = [];
    this.markValues = [];

    const { minValue, maxValue } = this.slider.getOptions();
    const scaleLength: number = Math.abs(maxValue - minValue);
    const scaleStepSize: number = this._calcScaleStep();
    const stepNumber: number = Math.abs(scaleLength / scaleStepSize);

    let i = 0;
    let value = minValue;

    while (i <= stepNumber) {
      const mark = document.createElement('li');
      mark.className = 'rslider-scale__mark';
      mark.innerText = value.toString(10);
      scale.appendChild(mark);

      this.scaleMarks.push(mark);
      this.markValues.push(value);

      value += scaleStepSize;
      i += 1;
    }
    return this.scale;
  }

  // used by RSlider
  private _render() {
    const { isHorizontal } = this.slider.getOptions();
    const layout = isHorizontal ? 'horizontal' : 'vertical';
    this.scale.className = `rslider-scale rslider-scale--layout_${layout}`;

    this._populateScale(this.scale);

    this.scale.addEventListener('click', (e) => {
      this.scaleMarks.forEach((el, index) => {
        if (e.target === el) {
          // jump to value on click
          const val = this.markValues[index];
          this.slider.setValue(val, 0);
        }
      });
    });

    this.slider.container.appendChild(this.scale);

    return this.scale;
  }

  public update() {
    this._populateScale(this.scale);
  }
}
