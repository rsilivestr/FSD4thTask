import SliderOptions from './_interface/SliderOptions';
import Panel from './_interface/Panel';
import Presenter from './_interface/Presenter';

export default class RSPanel implements Panel {
  // inputs: HTMLInputElement[] = [];
  options: SliderOptions;
  presenter: Presenter;
  UI: {
    container: HTMLElement;
    inputs: HTMLInputElement[];
    panel: HTMLElement;
  } = {
    container: null,
    inputs: [],
    panel: null,
  };

  constructor(container: HTMLElement, o: SliderOptions) {
    this.UI.container = container;
    this.options = o;

    this._render();
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

  _render() {
    // Create panel element
    this.UI.panel = document.createElement('div');
    this.UI.panel.className = 'rslider-panel';

    const { handlerCount } = this.options;

    for (let i = 0; i < handlerCount; i += 1) {
      const name = `Handler #${i + 1}`;
      const input = this._createInput(this.UI.panel, name);

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          // const target: HTMLInputElement = <HTMLInputElement>e.target;
          const value = parseInt(this.UI.inputs[i].value, 10);

          this.presenter.setModelValue(i, value);
        }
      });

      this.UI.inputs.push(input);
    }

    // Append to container
    this.UI.container.appendChild(this.UI.panel);
  }

  update(v: number[]): number[] {
    // Update inputs
    this.UI.inputs.forEach((input, index) => {
      input.value = v[index].toString();
    });

    return v;
  }
}
