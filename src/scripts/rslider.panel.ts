// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

export default class RSPanel implements Observer {
  model;

  values: [];

  handlerInputs: HTMLInputElement[] = [];

  constructor(model) {
    this.model = model;
    model.addObserver(this);

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

    const minInput = document.createElement('input');
    minInput.type = 'number';
    minInput.className = 'rslider-panel__input';
    panel.appendChild(minInput);
    minInput.addEventListener('input', () => {
      const re = /^\d+$/;
      const valid = re.test(minInput.value);
      if (valid) {
        this.model.setOptions({ minValue: +minInput.value });
        // redraw view somehow
        this.model.updateHandlers(0, 0);
      }
    });

    const maxInput = document.createElement('input');
    maxInput.type = 'number';
    maxInput.className = 'rslider-panel__input';
    panel.appendChild(maxInput);
    maxInput.addEventListener('input', () => {
      const re = /^\d+$/;
      const valid = re.test(maxInput.value);
      if (valid) {
        this.model.setOptions({ maxValue: +maxInput.value });
        // redraw view somehow
        this.model.updateHandlers(0, 0);
      }
    });
    // minInput.addEventListener('keydown', this.model.setOptions({ maxValue: maxInput.value }));

    document.body.appendChild(panel);
  }

  update() {
    this.values = this.model.handlerValues;
    this.handlerInputs.forEach((input, index) => {
      // eslint-disable-next-line no-param-reassign
      input.value = this.values[index];
    });
  }
}
