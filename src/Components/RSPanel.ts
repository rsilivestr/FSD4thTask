import { Panel, PanelElements, Slider, SliderOptions } from './interfaces';

class RSPanel implements Panel {
  private options: SliderOptions;

  private slider: Slider;

  private UI: PanelElements = {
    configDiv: document.createElement('div'),
    container: null,
    valueInputs: [],
    panel: document.createElement('div'),
    valuesDiv: document.createElement('div'),
  };

  constructor(s: Slider) {
    this._init(s);
  }

  public update(values: number[]) {
    this.options = this.slider.getConfig();

    this._updateInputCount();

    values.forEach((value, index) => {
      this.UI.valueInputs[index].value = value.toString(10);
    });
  }

  private _updateInputCount() {
    // Remove 'old' inputs from DOM and 'state'
    this.UI.valueInputs.forEach((input) => input.parentElement.remove());
    this.UI.valueInputs = [];

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

  static _createInput(
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

  _onValueInputChange(e: KeyboardEvent, valueIndex: number) {
    if (e.key === 'Enter') {
      const value = parseInt((<HTMLInputElement>e.target).value, 10);

      this.slider.setValue(valueIndex, value);
    }
  }

  private _renderValueInputs() {
    const handlerValues = this.slider.getValues();

    handlerValues.forEach((value, index) => {
      // Create input, set value
      const labelText = `Handler #${index + 1}`;
      const input = RSPanel._createInput(this.UI.valuesDiv, labelText);
      input.value = value.toString(10);

      input.addEventListener('keydown', (e) => this._onValueInputChange(e, index));

      this.UI.valueInputs.push(input);
    });
  }

  private _setMinValue(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const minValue = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ minValue });
      input.value = this.options.minValue.toString(10);
    }
  }

  private _setMaxValue(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const maxValue = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ maxValue });
      input.value = this.options.maxValue.toString(10);
    }
  }

  private _setStepSize(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const stepSize = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ stepSize });
      input.value = this.options.maxValue.toString(10);
    }
  }

  private _setHandlerCount(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const handlerCount = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ handlerCount });
      input.value = this.options.maxValue.toString(10);
    }
  }

  private _setIsHorizontal(e: Event) {
    const input = <HTMLInputElement>e.target;
    const isHorizontal = input.checked;

    this.options = this.slider.setConfig({ isHorizontal });
    input.checked = this.options.isHorizontal;
  }

  private _setShowProgress(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showProgress = input.checked;

    this.options = this.slider.setConfig({ showProgress });
    input.checked = this.options.showProgress;
  }

  private _setShowScale(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showScale = input.checked;

    this.options = this.slider.setConfig({ showScale });
    input.checked = this.options.showScale;
  }

  private _setShowTooltip(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showTooltip = input.checked;

    this.options = this.slider.setConfig({ showTooltip });
    input.checked = this.options.showTooltip;
  }

  private _createMinValueInput() {
    const { minValue } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Min value');
    input.value = minValue.toString(10);
    input.addEventListener('keydown', (e) => this._setMinValue(e));
  }

  private _createMaxValueInput() {
    const { maxValue } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Max value');
    input.value = maxValue.toString(10);
    input.addEventListener('keydown', (e) => this._setMaxValue(e));
  }

  private _createStepSizeInput() {
    const { stepSize } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Step size');
    input.value = stepSize.toString(10);
    input.addEventListener('keydown', (e) => this._setStepSize(e));
  }

  _createHandlerCountInput() {
    const { handlerCount } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Handler count');
    input.value = handlerCount.toString(10);
    input.addEventListener('keydown', (e) => this._setHandlerCount(e));
  }

  _createIsHorizontalInput() {
    const { isHorizontal } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Is horizontal', true);
    input.checked = isHorizontal;
    input.addEventListener('change', (e) => this._setIsHorizontal(e));
  }

  _createShowProgressInput() {
    const { showProgress } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Show progress', true);
    input.checked = showProgress;
    input.addEventListener('change', (e) => this._setShowProgress(e));
  }

  _createShowScaleInput() {
    const { showScale } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Show scale', true);
    input.checked = showScale;
    input.addEventListener('change', (e) => this._setShowScale(e));
  }

  _createShowTooltipInput() {
    const { showTooltip } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Show tooltip', true);
    input.checked = showTooltip;
    input.addEventListener('change', (e) => this._setShowTooltip(e));
  }

  private _render() {
    // Set panel className
    this.UI.panel.className = 'rslider-panel';

    // Append input groups containers
    this.UI.panel.appendChild(this.UI.valuesDiv);
    this.UI.panel.appendChild(this.UI.configDiv);

    // Render handler value inputs
    this._renderValueInputs();

    // Config inputs
    this._createMinValueInput();

    this._createMaxValueInput();

    this._createStepSizeInput();

    this._createHandlerCountInput();

    this._createIsHorizontalInput();

    this._createShowProgressInput();

    this._createShowScaleInput();

    this._createShowTooltipInput();

    // Append to container
    this.UI.container.appendChild(this.UI.panel);
  }
}

export default RSPanel;
