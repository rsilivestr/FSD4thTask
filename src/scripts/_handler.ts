import HandlerOptions from './_interface/HandlerOptions';

export default class RSHandler {
  UI: { handler: HTMLElement; tooltip: HTMLElement } = { handler: null, tooltip: null };
  id: number;
  layout: string;
  tooltip: boolean;
  value: number;

  constructor(o: HandlerOptions) {
    this._init(o);
  }

  private _init(o: HandlerOptions) {
    // Save config
    this.id = o.id;
    this.layout = o.layout;
    this.tooltip = o.tooltip;
    this.value = o.value;
    // Create handler element
    this._createHandler();
  }

  private _createHandler(): HTMLElement {
    this.UI.handler = document.createElement('div');
    this.UI.handler.className = 'rslider__handler';
    this.UI.handler.dataset.id = this.id.toString();
    // Create tooltip element
    this._createTooltip();
    // Append tooltip
    if (this.tooltip) {
      this.UI.handler.appendChild(this.UI.tooltip);
    }
    return this.UI.handler;
  }

  private _createTooltip() {
    this.UI.tooltip = document.createElement('div');
    this.UI.tooltip.className = `rslider__tooltip rslider__tooltip--${this.layout}`;
    this.UI.tooltip.textContent = this.value.toString(10);

    return this.UI.tooltip;
  }

  private _updateTooltip() {
    this.UI.tooltip.textContent = this.value.toString(10);
  }

  public setPosition(coord: number) {
    this.UI.handler.style.left = `${coord}%`;
  }

  public toggleTooltip() {
    this.tooltip = !this.tooltip;

    if (this.tooltip) {
      this.UI.handler.appendChild(this.UI.tooltip);
    } else {
      this.UI.tooltip.remove();
    }
  }

  public getElement() {
    return this.UI.handler;
  }

  public updateValue(value: number) {
    this.value = value;
    this._updateTooltip();
  }
}
