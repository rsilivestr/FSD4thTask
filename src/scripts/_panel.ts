import SliderOptions from './_interface/SliderOptions';
import Panel from './_interface/Panel';
import RSubject from './_subject';
import Slider from './_interface/Slider';

export default class RSPanel extends RSubject implements Panel {
  options: SliderOptions;
  UI: {
    container: HTMLElement;
    inputs: HTMLInputElement[];
    panel: HTMLElement;
  } = {
    container: null,
    inputs: [],
    panel: null,
  };

  constructor(s: Slider) {
    super();

    this._init(s);
  }

  public notifyObservers: (index: number, value: number) => void = (index, value) => {
    this.observers.forEach((o) => o(index, value));
  };

  public update(v: number[]): number[] {
    // Update inputs
    this.UI.inputs.forEach((input, index) => {
      input.value = v[index].toString();
    });

    return v;
  }

  private _init(s: Slider) {
    this.UI.container = s.el;
    this.options = s.config();
    // Create and append panel
    this._render();
    // Subscribe to model updates
    s.addModelObserver(this.update.bind(this));
    s.notifyModelObservers();
    // Subscribe presenter to panel updates
    this.addObserver(s.value.bind(s));
  }

  private _createInput(parent: HTMLElement, labelText: string): HTMLInputElement {
    const label = document.createElement('label');
    label.className = 'rslider-panel__label';
    label.textContent = labelText;
    parent.appendChild(label);

    const input = document.createElement('input');
    input.className = 'rslider-panel__input';
    label.appendChild(input);

    return input;
  }

  private _render() {
    // Create panel element
    this.UI.panel = document.createElement('div');
    this.UI.panel.className = 'rslider-panel';

    const { handlerCount } = this.options;

    for (let i = 0; i < handlerCount; i += 1) {
      const name = `Handler #${i + 1}`;
      const input = this._createInput(this.UI.panel, name);

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const value = parseInt(this.UI.inputs[i].value, 10);

          this.notifyObservers(i, value);
        }
      });

      this.UI.inputs.push(input);
    }

    // Append to container
    this.UI.container.appendChild(this.UI.panel);
  }
}
