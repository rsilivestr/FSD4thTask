import SliderOptions from './interface/SliderOptions';
import Panel from './interface/Panel';
import Slider from './interface/Slider';

type PanelElements = {
  container: HTMLElement;
  inputs: HTMLInputElement[];
  panel: HTMLElement;
};

export default class RSPanel implements Panel {
  private options: SliderOptions;

  private slider: Slider;

  private UI: PanelElements = {
    container: null,
    inputs: [],
    panel: null,
  };

  constructor(s: Slider) {
    this._init(s);
  }

  public update(v: number[]): number[] {
    // Update inputs
    this.UI.inputs.forEach((input, index) => {
      input.value = v[index].toString();
    });

    return v;
  }

  private _init(s: Slider) {
    // Save slider
    this.slider = s;
    this.UI.container = s.getContainer();
    this.options = s.getConfig();
    // Create and append panel
    this._render();
    // Subscribe to slider updates
    this.slider.addObserver(this.update.bind(this));
  }

  private _createInput(labelText: string, isCheckbox: boolean = false): HTMLInputElement {
    const label = document.createElement('label');
    label.className = 'rslider-panel__label';
    label.textContent = labelText;
    this.UI.panel.appendChild(label);

    const input = document.createElement('input');
    input.className = 'rslider-panel__input';
    if (isCheckbox) {
      input.type = 'checkbox';
    }
    label.appendChild(input);

    return input;
  }

  private _render() {
    // Create panel element
    this.UI.panel = document.createElement('div');
    this.UI.panel.className = 'rslider-panel';

    const { handlerCount } = this.options;
    const handlerValues = this.slider.getValues();

    // Render handler value inputs
    for (let i = 0; i < handlerCount; i += 1) {
      const name = `Handler #${i + 1}`;
      const input = this._createInput(name);
      input.value = handlerValues[i].toString(10);

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const value = parseInt(input.value, 10);

          this.slider.setValue(i, value);
        }
      });

      this.UI.inputs.push(input);
    }

    // Create min input
    const minInput = this._createInput('minValue');
    minInput.value = this.options.minValue.toString(10);
    minInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const minValue = parseInt(minInput.value, 10);

        this.slider.setConfig({ minValue });
      }
    });

    // Create max input
    const maxInput = this._createInput('maxValue');
    maxInput.value = this.options.maxValue.toString(10);
    maxInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const maxValue = parseInt(maxInput.value, 10);

        this.slider.setConfig({ maxValue });
      }
    });

    // Create step input
    const stepInput = this._createInput('stepSize');
    stepInput.value = this.options.stepSize.toString(10);
    stepInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const stepSize = parseInt(stepInput.value, 10);

        this.slider.setConfig({ stepSize });
      }
    });

    // Create isHorizontal checkbox
    const isHorizontalInput = this._createInput('isHorizontal', true);
    isHorizontalInput.checked = this.options.isHorizontal;
    isHorizontalInput.addEventListener('change', () => {
      this.slider.setConfig({ isHorizontal: isHorizontalInput.checked });
    });

    // Create tooltip checkbox
    const tooltipInput = this._createInput('tooltip', true);
    tooltipInput.checked = this.options.isHorizontal;
    tooltipInput.addEventListener('change', () => {
      this.slider.setConfig({ tooltip: tooltipInput.checked });
    });

    // Create progress checkbox
    const progressInput = this._createInput('progress', true);
    progressInput.checked = this.options.isHorizontal;
    progressInput.addEventListener('change', () => {
      this.slider.setConfig({ progress: progressInput.checked });
    });

    // Append to container
    this.UI.container.appendChild(this.UI.panel);
  }
}
