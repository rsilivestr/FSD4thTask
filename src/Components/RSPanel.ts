import { Slider, SliderOptions } from './RSlider';

export interface Panel {
  update(v: number[]): number[];
}

type PanelElements = {
  configDiv: HTMLDivElement;
  container: HTMLElement;
  inputs: HTMLInputElement[];
  panel: HTMLElement;
  valuesDiv: HTMLDivElement;
};

export default class RSPanel implements Panel {
  private options: SliderOptions;

  private slider: Slider;

  private UI: PanelElements = {
    configDiv: document.createElement('div'),
    container: null,
    inputs: [],
    panel: document.createElement('div'),
    valuesDiv: document.createElement('div'),
  };

  constructor(s: Slider) {
    this._init(s);
  }

  public update(v: number[]): number[] {
    this.options = this.slider.getConfig();

    this._updateInputCount();

    // Update inputs
    this.UI.inputs.forEach((input, index) => {
      input.value = v[index].toString();
    });

    return v;
  }

  private _updateInputCount() {
    // Remove 'old' inputs from DOM and 'state'
    this.UI.inputs.forEach((input) => input.parentElement.remove());
    this.UI.inputs = [];

    this._renderValueInputs();
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

  private _createInput(
    parent: HTMLDivElement,
    labelText: string,
    isCheckbox: boolean = false
  ): HTMLInputElement {
    const label = document.createElement('label');
    label.className = 'rslider-panel__label';
    label.textContent = labelText;
    parent.appendChild(label);

    const input = document.createElement('input');
    input.className = 'rslider-panel__input';
    if (isCheckbox) {
      input.type = 'checkbox';
    }
    label.appendChild(input);

    return input;
  }

  private _renderValueInputs() {
    const { handlerCount } = this.options;
    const handlerValues = this.slider.getValues();

    for (let i = 0; i < handlerCount; i += 1) {
      const name = `Handler #${i + 1}`;
      const input = this._createInput(this.UI.valuesDiv, name);
      input.value = handlerValues[i].toString(10);

      input.addEventListener('keyup', (e) => {
        if (e.key === 'Enter') {
          const value = parseInt(input.value, 10);

          this.slider.setValue(i, value);
        }
      });

      this.UI.inputs.push(input);
    }
  }

  private _render() {
    // Set panel className
    this.UI.panel.className = 'rslider-panel';

    // Append containers for input groups
    this.UI.panel.appendChild(this.UI.valuesDiv);
    this.UI.panel.appendChild(this.UI.configDiv);

    const {
      minValue,
      maxValue,
      stepSize,
      handlerCount,
      isHorizontal,
      showProgress,
      showScale,
      showTooltip,
    } = this.options;

    // Render handler value inputs
    this._renderValueInputs();

    // Create min input
    const minInput = this._createInput(this.UI.configDiv, 'Min value');
    minInput.value = minValue.toString(10);
    minInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const minValue = parseInt(minInput.value, 10);

        this.options = this.slider.setConfig({ minValue });

        minInput.value = this.options.minValue.toString(10);
      }
    });

    // Create max input
    const maxInput = this._createInput(this.UI.configDiv, 'Max value');
    maxInput.value = maxValue.toString(10);
    maxInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const maxValue = parseInt(maxInput.value, 10);

        this.options = this.slider.setConfig({ maxValue });

        maxInput.value = this.options.maxValue.toString(10);
      }
    });

    // Create step input
    const stepInput = this._createInput(this.UI.configDiv, 'Step size');
    stepInput.value = stepSize.toString(10);
    stepInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const stepSize = parseInt(stepInput.value, 10);

        this.options = this.slider.setConfig({ stepSize });

        stepInput.value = this.options.stepSize.toString(10);
      }
    });

    // Create handlerCount input
    const handlerCountInput = this._createInput(this.UI.configDiv, 'Handler count');
    handlerCountInput.value = handlerCount.toString(10);
    handlerCountInput.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') {
        const handlerCount = parseInt(handlerCountInput.value, 10);

        this.options = this.slider.setConfig({ handlerCount });

        // If handlerCount > 2 progress is disabled
        progressInput.checked = this.options.showProgress;
      }
    });

    // Create isHorizontal checkbox
    const isHorizontalInput = this._createInput(this.UI.configDiv, 'Is horizontal', true);
    isHorizontalInput.checked = isHorizontal;
    isHorizontalInput.addEventListener('change', () => {
      this.options = this.slider.setConfig({ isHorizontal: isHorizontalInput.checked });

      isHorizontalInput.checked = this.options.isHorizontal;
    });

    // Create progress checkbox
    const progressInput = this._createInput(this.UI.configDiv, 'Show progress', true);
    progressInput.checked = showProgress;
    progressInput.addEventListener('change', () => {
      this.options = this.slider.setConfig({ showProgress: progressInput.checked });

      // Update value validated by slider
      progressInput.checked = this.options.showProgress;
    });

    // Create scale checkbox
    const scaleInput = this._createInput(this.UI.configDiv, 'Show scale', true);
    scaleInput.checked = showScale;
    scaleInput.addEventListener('change', () => {
      this.options = this.slider.setConfig({ showScale: scaleInput.checked });

      // Update value validated by slider
      scaleInput.checked = this.options.showScale;
    });

    // Create tooltip checkbox
    const tooltipInput = this._createInput(this.UI.configDiv, 'Show tooltip', true);
    tooltipInput.checked = showTooltip;
    tooltipInput.addEventListener('change', () => {
      this.options = this.slider.setConfig({ showTooltip: tooltipInput.checked });
    });

    // Append to container
    this.UI.container.appendChild(this.UI.panel);
  }
}
