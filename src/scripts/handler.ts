import HandlerOptions from './interface/HandlerOptions';

export default class RSHandler {
  private id: number;
  private layout: string;
  private tooltip: boolean;
  private UI: {
    handler: HTMLElement;
    tooltip: HTMLElement;
  } = {
    handler: null,
    tooltip: null,
  };
  private value: number;

  constructor(o: HandlerOptions) {
    this._init(o);
  }

  public getElement() {
    return this.UI.handler;
  }

  public setPosition(coord: number) {
    if (this.layout === 'horizontal') {
      this.UI.handler.style.left = `${coord}%`;
    } else {
      this.UI.handler.style.bottom = `${coord}%`;
    }
  }

  public toggleTooltip() {
    this.tooltip = !this.tooltip;

    if (this.tooltip) {
      // Create and append tooltip
      this.UI.tooltip = this._createTooltip();
      this.UI.handler.appendChild(this.UI.tooltip);
    } else {
      // Remove tooltip element
      this.UI.tooltip.remove();
    }
  }

  public updateValue(value: number) {
    this.value = value;
    this._updateTooltip();
  }

  private _createHandler(): HTMLElement {
    const handler = document.createElement('div');
    handler.className = 'rslider__handler';
    handler.dataset.id = this.id.toString();

    if (this.tooltip) {
      // Create tooltip element
      this.UI.tooltip = this._createTooltip();
      // Append tooltip
      handler.appendChild(this.UI.tooltip);
    }
    return handler;
  }

  private _createTooltip(): HTMLElement {
    const tooltip = document.createElement('div');
    tooltip.className = `rslider__tooltip rslider__tooltip--${this.layout}`;
    tooltip.textContent = this.value.toString(10);

    return tooltip;
  }

  private _init(o: HandlerOptions) {
    // Save config
    this.id = o.id;
    this.layout = o.layout;
    this.tooltip = o.tooltip;
    this.value = o.value;
    // Create handler element
    this.UI.handler = this._createHandler();
  }

  private _updateTooltip() {
    this.UI.tooltip.textContent = this.value.toString(10);
  }
}
