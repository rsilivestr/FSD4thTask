import { Observer } from './interfaces';
import { ModelOptions } from './rslider.model';
import { ViewOptions } from './rslider.view';
import { Slider } from './rslider';

export interface Panel extends Observer {
  slider: Slider;
  modelOptions: ModelOptions;
  viewOptions: ViewOptions;
  container: HTMLElement;
  values: number[];
  handlerInputs: HTMLInputElement[];

  update(): void;
}

export default class RSPanel implements Panel {
  slider: Slider;
  modelOptions: ModelOptions;
  viewOptions: ViewOptions;
  container: HTMLElement;
  values: number[];
  handlerInputs: HTMLInputElement[] = [];

  constructor(slider: Slider) {
    this.slider = slider;

    this._init();
  }

  private _init() {
    this.slider.model.addObserver(this);
    this.modelOptions = this.slider.model.getOptions();

    this.viewOptions = this.slider.view.getOptions();

    this.container = this.slider.container;

    this.values = this.slider.getValues();

    this._render();
  }

  private _createInput(
    parent: HTMLElement,
    labelText: string
  ): HTMLInputElement {
    const label = document.createElement('label');
    label.className = 'rslider-panel__label';
    label.innerText = labelText;
    parent.appendChild(label);

    const input = document.createElement('input');
    input.className = 'rslider-panel__input';
    label.appendChild(input);

    return input;
  }

  private _setHandlerValue(input: HTMLInputElement, index: number): number {
    const inputValue = input.value;
    const valid = /^-?\d+$/.test(inputValue);

    if (valid) {
      this.slider.setValue(parseInt(inputValue), index);
    }

    const value = this.slider.getValue(index);

    input.value = value.toString();

    return value;
  }

  private _setModelOption(
    input: HTMLInputElement,
    key: keyof ModelOptions
  ): ModelOptions {
    const options: ModelOptions = {};
    const value: number = +input.value;

    if (key !== 'range' && key !== 'changed') {
      options[key] = value;
    }

    this.slider.setOptions(options);

    return this.modelOptions;
  }

  // used in rslider.ts
  private _render() {
    const panel: HTMLElement = document.createElement('div');
    panel.className = 'rslider-panel';

    const { handlerCount } = this.modelOptions;

    for (let i = 0; i < handlerCount; i += 1) {
      const name = `Handler #${i + 1}`;
      const input = this._createInput(panel, name);

      input.value = this.values[i].toString(10);

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          this._setHandlerValue(<HTMLInputElement>e.target, i);
        }
      });

      this.handlerInputs.push(input);
    }

    const minInput = this._createInput(panel, 'Min value');
    minInput.value = this.modelOptions.minValue.toString(10);
    minInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._setModelOption(<HTMLInputElement>e.target, 'minValue');
      }
    });

    const maxInput = this._createInput(panel, 'Max value');
    maxInput.value = this.modelOptions.maxValue.toString(10);
    maxInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._setModelOption(<HTMLInputElement>e.target, 'maxValue');
      }
    });

    const stepInput = this._createInput(panel, 'Step size');
    stepInput.value = this.modelOptions.stepSize.toString(10);
    stepInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        this._setModelOption(<HTMLInputElement>e.target, 'stepSize');
      }
    });

    const tooltipInput = this._createInput(panel, 'Tooltip');
    tooltipInput.type = 'checkbox';
    tooltipInput.checked = this.viewOptions.tooltip;
    tooltipInput.addEventListener('change', () => {
      this.slider.setOptions({ tooltip: tooltipInput.checked });
    });

    this.container.appendChild(panel);

    return panel;
  }

  public update() {
    this.values = this.slider.getValues();
    this.handlerInputs.forEach((input, index) => {
      input.value = this.values[index].toString(10);
    });
  }
}
