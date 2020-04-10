// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

export default class RSPanel implements Observer {
  model;

  modelOptions;

  container: HTMLElement;

  values: [];

  handlerInputs: HTMLInputElement[] = [];

  constructor(model, container) {
    this.model = model;
    model.addObserver(this);

    this.modelOptions = this.model.getOptions();

    this.container = container;

    this.values = this.model.handlerValues.slice();
  }

  // eslint-disable-next-line class-methods-use-this
  createInput(parent: HTMLElement, labelText: string) {
    const label = document.createElement('label');
    label.className = 'rslider-panel__label';
    label.innerText = labelText;
    parent.appendChild(label);

    const input = document.createElement('input');
    input.className = 'rslider-panel__input';
    input.type = 'number';
    label.appendChild(input);

    return input;
  }

  setHandlerValue(e: KeyboardEvent, index: number) {
    if (e.key === 'Enter') {
      const input: HTMLInputElement = <HTMLInputElement>e.target;
      const inputValue: string = input.value;

      const re = /^-?\d+$/;
      const valid = re.test(inputValue);

      if (valid) {
        this.model.updateValue(index, +inputValue);
      }
    }
  }

  setModelOption(e: Event, key: string) {
    const input: HTMLInputElement = <HTMLInputElement>e.target;
    const options: Object = {};

    if (key === 'stepSize') {
      options[key] = Math.abs(+input.value);
    } else {
      options[key] = +input.value;
    }

    this.model.setOptions(options);
  }

  render() {
    const panel = document.createElement('div');
    panel.className = 'rslider-panel';

    const { handlerCount } = this.model.options;

    for (let i = 0; i < handlerCount; i += 1) {
      const name = `Handler #${i + 1}`;
      const input = this.createInput(panel, name);

      input.value = this.values[i];

      input.addEventListener('keyup', (e) => { this.setHandlerValue(e, i); });

      this.handlerInputs.push(input);
    }

    const minInput = this.createInput(panel, 'Min value');
    minInput.value = this.modelOptions.minValue;
    minInput.addEventListener('input', (e) => { this.setModelOption(e, 'minValue'); });

    const maxInput = this.createInput(panel, 'Max value');
    maxInput.value = this.modelOptions.maxValue;
    maxInput.addEventListener('input', (e) => { this.setModelOption(e, 'maxValue'); });

    const stepInput = this.createInput(panel, 'Step size');
    stepInput.value = this.modelOptions.stepSize;
    stepInput.addEventListener('input', (e) => { this.setModelOption(e, 'stepSize'); });

    // stepInput.addEventListener('input', () => {
    //   const re = /^\d+$/;
    //   const valid = re.test(stepInput.value);
    //   if (valid) {
    //     this.model.setOptions({ stepSize: +stepInput.value });
    //   }
    // });

    this.container.appendChild(panel);
  }

  update() {
    this.values = this.model.handlerValues;
    this.handlerInputs.forEach((input, index) => {
      // eslint-disable-next-line no-param-reassign
      input.value = this.values[index];
    });
  }
}
