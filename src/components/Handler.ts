import * as types from './types';

class Handler implements types.Handler {
  private coord: number;

  private id: number;

  private layout: string;

  private tooltip: boolean;

  private UI: types.HandlerElements = {
    handler: null,
    tooltip: null,
  };

  private value: number;

  constructor(o: types.HandlerOptions) {
    this.init(o);
  }

  public getElement(): HTMLElement {
    return this.UI.handler;
  }

  public setPosition(coord: number): void {
    this.coord = coord;

    if (this.layout === 'horizontal') {
      this.UI.handler.style.left = `${coord}%`;
    } else {
      this.UI.handler.style.bottom = `${coord}%`;
    }
  }

  public toggleTooltip(value: boolean = null): boolean {
    if (value === null) {
      this.tooltip = !this.tooltip;
    } else {
      this.tooltip = value;
    }

    if (this.tooltip && !this.UI.tooltip) {
      // If ON but does not exist already
      this.UI.tooltip = this.createTooltip();
      this.UI.handler.appendChild(this.UI.tooltip);
    } else if (!this.tooltip && this.UI.tooltip) {
      // If OFF and already exists
      this.UI.tooltip.remove();
      this.UI.tooltip = null;
    }

    return this.tooltip;
  }

  public toggleLayout(layout: 'horizontal' | 'vertical'): void {
    this.layout = layout;

    this.UI.handler.removeAttribute('style');

    this.setPosition(this.coord);

    if (this.UI.tooltip) {
      this.UI.tooltip.classList.remove('rslider__tooltip--horizontal');
      this.UI.tooltip.classList.remove('rslider__tooltip--vertical');

      this.UI.tooltip.classList.add(`rslider__tooltip--${layout}`);
    }
  }

  public updateValue(value: number): void {
    this.value = value;

    if (this.tooltip) {
      this.updateTooltip();
    }
  }

  private createHandler(): HTMLElement {
    const handler = document.createElement('div');
    handler.className = 'rslider__handler';
    handler.dataset.id = this.id.toString();

    if (this.tooltip) {
      // Create tooltip element
      this.UI.tooltip = this.createTooltip();

      // Append tooltip
      handler.appendChild(this.UI.tooltip);
    }

    return handler;
  }

  private createTooltip(): HTMLElement {
    const tooltip = document.createElement('div');
    tooltip.className = `rslider__tooltip rslider__tooltip--${this.layout}`;
    tooltip.textContent = this.value.toString(10);

    return tooltip;
  }

  private init(o: types.HandlerOptions): void {
    this.id = o.id;
    this.layout = o.layout;
    this.tooltip = o.tooltip;
    this.value = o.value;

    this.UI.handler = this.createHandler();
  }

  private updateTooltip(): void {
    this.UI.tooltip.textContent = this.value.toString(10);
  }
}

export default Handler;
