import { boundMethod } from 'autobind-decorator';

import { TPanel, TSliderOptions, TSlider, TPanelElements } from './types';

class Panel implements TPanel {
  private options!: TSliderOptions;

  private slider!: TSlider;

  private UI!: TPanelElements;

  constructor(slider: TSlider) {
    this.init(slider);
  }

  static createInput(
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
    this.UI.valueInputs.forEach((input) => {
      const inputLabel = input.parentElement;
      if (inputLabel) inputLabel.remove();
    });
    this.UI.valueInputs = [];

    this.renderValueInputs();
  }

  private init(slider: TSlider) {
    this.slider = slider;

    this.UI = {
      configDiv: document.createElement('div'),
      container: slider.getContainer(),
      valueInputs: [],
      configInputs: {},
      panel: document.createElement('div'),
      valuesDiv: document.createElement('div'),
    };

    this.options = slider.getConfig();

    this.render();

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
      const input = Panel.createInput(this.UI.valuesDiv, labelText);
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

      this.slider.setConfig({ minValue });
      this.options = this.slider.getConfig();
      input.value = this.options.minValue.toString(10);
    }
  }

  @boundMethod
  private setMaxValue(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const maxValue = parseInt(input.value, 10);

      this.slider.setConfig({ maxValue });
      this.options = this.slider.getConfig();
      input.value = this.options.maxValue.toString(10);
    }
  }

  @boundMethod
  private setStepSize(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const stepSize = parseInt(input.value, 10);

      this.slider.setConfig({ stepSize });
      this.options = this.slider.getConfig();
      input.value = this.options.stepSize.toString(10);
    }
  }

  @boundMethod
  private setHandlerCount(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      const input = <HTMLInputElement>e.target;
      const handlerCount = parseInt(input.value, 10);

      this.slider.setConfig({ handlerCount });
      this.options = this.slider.getConfig();
      input.value = this.options.handlerCount.toString(10);

      this.UI.configInputs.showProgress.checked = this.options.showProgress;
    }
  }

  @boundMethod
  private setIsHorizontal(e: Event) {
    const input = <HTMLInputElement>e.target;
    const isHorizontal = input.checked;

    this.slider.setConfig({ isHorizontal });
    this.options = this.slider.getConfig();
    input.checked = this.options.isHorizontal;
  }

  @boundMethod
  private setShowProgress(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showProgress = input.checked;

    this.slider.setConfig({ showProgress });
    this.options = this.slider.getConfig();
    input.checked = this.options.showProgress;
  }

  @boundMethod
  private setShowScale(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showScale = input.checked;

    this.slider.setConfig({ showScale });
    this.options = this.slider.getConfig();
    input.checked = this.options.showScale;
  }

  @boundMethod
  private setShowTooltip(e: Event) {
    const input = <HTMLInputElement>e.target;
    const showTooltip = input.checked;

    this.slider.setConfig({ showTooltip });
    this.options = this.slider.getConfig();
    input.checked = this.options.showTooltip;
  }

  private createMinValueInput() {
    const { minValue } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Min value');
    input.value = minValue.toString(10);

    input.addEventListener('keydown', this.setMinValue);

    this.UI.configInputs.minValue = input;
  }

  private createMaxValueInput() {
    const { maxValue } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Max value');
    input.value = maxValue.toString(10);

    input.addEventListener('keydown', this.setMaxValue);

    this.UI.configInputs.maxValue = input;
  }

  private createStepSizeInput() {
    const { stepSize } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Step size');
    input.value = stepSize.toString(10);

    input.addEventListener('keydown', this.setStepSize);

    this.UI.configInputs.stepSize = input;
  }

  private createHandlerCountInput() {
    const { handlerCount } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Handler count');
    input.value = handlerCount.toString(10);

    input.addEventListener('keydown', this.setHandlerCount);

    this.UI.configInputs.handlerCount = input;
  }

  private createIsHorizontalInput() {
    const { isHorizontal } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Is horizontal', true);
    input.checked = isHorizontal;

    input.addEventListener('change', this.setIsHorizontal);

    this.UI.configInputs.isHorizontal = input;
  }

  private createShowProgressInput() {
    const { showProgress } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Show progress', true);
    input.checked = showProgress;

    input.addEventListener('change', this.setShowProgress);

    this.UI.configInputs.showProgress = input;
  }

  private createShowScaleInput() {
    const { showScale } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Show scale', true);
    input.checked = showScale;

    input.addEventListener('change', this.setShowScale);

    this.UI.configInputs.showScale = input;
  }

  private createShowTooltipInput() {
    const { showTooltip } = this.options;
    const input = Panel.createInput(this.UI.configDiv, 'Show tooltip', true);
    input.checked = showTooltip;

    input.addEventListener('change', this.setShowTooltip);

    this.UI.configInputs.showTooltip = input;
  }

  private render() {
    this.UI.panel.className = 'rslider-panel';

    this.UI.panel.appendChild(this.UI.valuesDiv);
    this.UI.panel.appendChild(this.UI.configDiv);

    this.renderValueInputs();

    this.createMinValueInput();
    this.createMaxValueInput();
    this.createStepSizeInput();
    this.createHandlerCountInput();
    this.createIsHorizontalInput();
    this.createShowProgressInput();
    this.createShowScaleInput();
    this.createShowTooltipInput();

    this.UI.container.appendChild(this.UI.panel);
  }
}

export default Panel;
