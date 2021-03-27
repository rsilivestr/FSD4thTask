import { boundMethod } from 'autobind-decorator';
import { Panel, PanelElements, Slider, SliderOptions } from './interfaces';

class RSPanel implements Panel {
  private options: SliderOptions;

  private slider: Slider;

  private UI: PanelElements = {
    configDiv: document.createElement('div'),
    container: null,
    valueInputs: [],
    configInputs: {},
    panel: document.createElement('div'),
    valuesDiv: document.createElement('div'),
  };

  constructor(s: Slider) {
    this.init(s);
  }

  static _createInput(
    parent: HTMLElement,
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

  public update(values: number[]) {
    this.options = this.slider.getConfig();

    this.updateInputCount();

    values.forEach((value, index) => {
      this.UI.valueInputs[index].value = value.toString(10);
    });
  }

  private updateInputCount() {
    // Remove 'old' inputs from DOM and 'state'
    this.UI.valueInputs.forEach((input) => input.parentElement.remove());
    this.UI.valueInputs = [];

    this.renderValueInputs();
  }

  private init(s: Slider) {
    // Save slider
    this.slider = s;
    this.UI.container = s.getContainer();
    this.options = s.getConfig();

    // Create and append panel
    this.render();

    // Subscribe to slider updates
    this.slider.addObserver(this.update.bind(this));
  }

  private onValueInputChange(e: KeyboardEvent, valueIndex: number) {
    if (e.key === 'Enter') {
      const value = parseInt((<HTMLInputElement>e.target).value, 10);

      this.slider.setValue(valueIndex, value);
    }
  }

  private renderValueInputs() {
    const handlerValues = this.slider.getValues();

    handlerValues.forEach((value, index) => {
      // Create input, set value
      const labelText = `Handler #${index + 1}`;
      const input = RSPanel._createInput(this.UI.valuesDiv, labelText);
      input.value = value.toString(10);

      input.addEventListener('keydown', (e) => this.onValueInputChange(e, index));

      this.UI.valueInputs.push(input);
    });
  }

  @boundMethod
  private setMinValue(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const minValue = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ minValue });
      input.value = this.options.minValue.toString(10);
    }
  }

  @boundMethod
  private setMaxValue(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const maxValue = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ maxValue });
      input.value = this.options.maxValue.toString(10);
    }
  }

  @boundMethod
  private setStepSize(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const stepSize = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ stepSize });
      input.value = this.options.stepSize.toString(10);
    }
  }

  @boundMethod
  private setHandlerCount(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const handlerCount = parseInt(input.value, 10);

      this.options = this.slider.setConfig({ handlerCount });
      input.value = this.options.handlerCount.toString(10);

      // Update showProgress input
      this.UI.configInputs.showProgress.checked = this.options.showProgress;
    }
  }

  @boundMethod
  private setIsHorizontal(e: Event) {
    const input = <HTMLInputElement>e.target;
    const isHorizontal = input.checked;

    this.options = this.slider.setConfig({ isHorizontal });
    input.checked = this.options.isHorizontal;
  }

  @boundMethod
  private setShowProgress(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showProgress = input.checked;

    this.options = this.slider.setConfig({ showProgress });
    input.checked = this.options.showProgress;
  }

  @boundMethod
  private setShowScale(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showScale = input.checked;

    this.options = this.slider.setConfig({ showScale });
    input.checked = this.options.showScale;
  }

  @boundMethod
  private setShowTooltip(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showTooltip = input.checked;

    this.options = this.slider.setConfig({ showTooltip });
    input.checked = this.options.showTooltip;
  }

  private createMinValueInput() {
    const { minValue } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Min value');
    input.value = minValue.toString(10);

    input.addEventListener('keydown', this.setMinValue);

    this.UI.configInputs.minValue = input;
  }

  private createMaxValueInput() {
    const { maxValue } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Max value');
    input.value = maxValue.toString(10);

    input.addEventListener('keydown', this.setMaxValue);

    this.UI.configInputs.maxValue = input;
  }

  private createStepSizeInput() {
    const { stepSize } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Step size');
    input.value = stepSize.toString(10);

    input.addEventListener('keydown', this.setStepSize);

    this.UI.configInputs.stepSize = input;
  }

  private createHandlerCountInput() {
    const { handlerCount } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Handler count');
    input.value = handlerCount.toString(10);

    input.addEventListener('keydown', this.setHandlerCount);

    this.UI.configInputs.handlerCount = input;
  }

  private createIsHorizontalInput() {
    const { isHorizontal } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Is horizontal', true);
    input.checked = isHorizontal;

    input.addEventListener('change', this.setIsHorizontal);

    this.UI.configInputs.isHorizontal = input;
  }

  private createShowProgressInput() {
    const { showProgress } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Show progress', true);
    input.checked = showProgress;

    input.addEventListener('change', this.setShowProgress);

    this.UI.configInputs.showProgress = input;
  }

  private createShowScaleInput() {
    const { showScale } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Show scale', true);
    input.checked = showScale;

    input.addEventListener('change', this.setShowScale);

    this.UI.configInputs.showScale = input;
  }

  private createShowTooltipInput() {
    const { showTooltip } = this.options;
    const input = RSPanel._createInput(this.UI.configDiv, 'Show tooltip', true);
    input.checked = showTooltip;

    input.addEventListener('change', this.setShowTooltip);

    this.UI.configInputs.showTooltip = input;
  }

  private render() {
    // Set panel className
    this.UI.panel.className = 'rslider-panel';

    // Append input groups containers
    this.UI.panel.appendChild(this.UI.valuesDiv);
    this.UI.panel.appendChild(this.UI.configDiv);

    // Render handler value inputs
    this.renderValueInputs();

    // Config inputs
    this.createMinValueInput();

    this.createMaxValueInput();

    this.createStepSizeInput();

    this.createHandlerCountInput();

    this.createIsHorizontalInput();

    this.createShowProgressInput();

    this.createShowScaleInput();

    this.createShowTooltipInput();

    // Append to container
    this.UI.container.appendChild(this.UI.panel);
  }
}

export default RSPanel;
