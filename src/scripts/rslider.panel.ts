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

  render() {
    const panel = document.createElement('div');
    panel.className = 'rslider-panel';

    const { handlerCount } = this.model.options;

    for (let i = 0; i < handlerCount; i += 1) {
      const label = document.createElement('label');
      label.className = 'rslider-panel__label';
      label.innerText = `Handler #${i + 1} `;

      const input = document.createElement('input');
      input.className = 'rslider-panel__input';
      input.type = 'number';
      input.value = this.values[i];

      label.appendChild(input);
      panel.appendChild(label);

      this.handlerInputs.push(input);
    }

    const minLabel = document.createElement('label');
    minLabel.innerText = 'Min value';
    minLabel.className = 'rslider-panel__label';
    panel.appendChild(minLabel);

    const minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.className = 'rslider-panel__input';
    minLabel.appendChild(minInput);

    minInput.value = this.modelOptions.minValue;

    minInput.addEventListener('input', () => {
      const re = /^-?\d+$/;
      const valid = re.test(minInput.value);
      if (valid) {
        this.model.setOptions({ minValue: +minInput.value });
      }
    });

    const maxLabel = document.createElement('label');
    maxLabel.innerText = 'Max value';
    maxLabel.className = 'rslider-panel__label';
    panel.appendChild(maxLabel);

    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.className = 'rslider-panel__input';
    maxLabel.appendChild(maxInput);

    maxInput.value = this.modelOptions.maxValue;

    maxInput.addEventListener('input', () => {
      const re = /^-?\d+$/;
      const valid = re.test(maxInput.value);
      if (valid) {
        this.model.setOptions({ maxValue: +maxInput.value });
      }
    });

    const stepLabel = document.createElement('label');
    stepLabel.innerText = 'Step size: ';
    stepLabel.className = 'rslider-panel__label';
    panel.appendChild(stepLabel);

    const stepInput = document.createElement('input');
    stepInput.type = 'number';
    stepInput.className = 'rslider-panel__input';
    stepLabel.appendChild(stepInput);

    stepInput.value = this.modelOptions.stepSize;

    stepInput.addEventListener('input', () => {
      const re = /^\d+$/;
      const valid = re.test(stepInput.value);
      if (valid) {
        this.model.setOptions({ stepSize: +stepInput.value });
      }
    });


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
