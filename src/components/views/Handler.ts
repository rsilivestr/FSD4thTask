import { THandler, THandlerElements, THandlerOptions } from './types';

class Handler implements THandler {
  private coord!: number;

  private id!: number;

  private layout!: string;

  private tooltip!: boolean;

  private UI: THandlerElements = {
    handler: Handler.createHandler(),
    tooltip: Handler.createTooltip(),
  };

  private value!: number;

  constructor(o: THandlerOptions) {
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

  public setZIndex(sliderLength: number, coord: number) {
    this.UI.handler.style.zIndex = Math.floor(
      2 + Math.abs(sliderLength ** 2 / (50 - coord))
    ).toString();
  }

  public toggleTooltip(value: boolean | null = null): boolean {
    if (value === null) {
      this.tooltip = !this.tooltip;
    } else {
      this.tooltip = value;
    }

    if (this.tooltip) {
      this.UI.handler.appendChild(this.UI.tooltip);
      this.updateTooltip();
    } else {
      this.UI.tooltip.remove();
    }

    return this.tooltip;
  }

  public toggleLayout(layout: 'horizontal' | 'vertical'): void {
    this.layout = layout;

    this.UI.handler.removeAttribute('style');

    this.setPosition(this.coord);

    if (this.UI.tooltip) {
      const oldLayout = layout === 'horizontal' ? 'vertical' : 'horizontal';
      this.UI.tooltip.classList.remove(`rslider__tooltip--${oldLayout}`);
      this.UI.tooltip.classList.add(`rslider__tooltip--${layout}`);
    }
  }

  public updateValue(value: number): void {
    this.value = value;

    if (this.tooltip) {
      this.updateTooltipValue();
    }
  }

  static createHandler(): HTMLElement {
    const handler = document.createElement('div');
    handler.className = 'rslider__handler';

    return handler;
  }

  private initHandler(): void {
    this.UI.handler.dataset.id = this.id.toString();

    if (this.tooltip) {
      this.updateTooltip();
      this.UI.handler.appendChild(this.UI.tooltip);
    }
  }

  static createTooltip(): HTMLElement {
    const tooltip = document.createElement('div');
    tooltip.className = 'rslider__tooltip';

    return tooltip;
  }

  private updateTooltip(): void {
    this.UI.tooltip.classList.add(`rslider__tooltip--${this.layout}`);
    this.updateTooltipValue();
  }

  private init(o: THandlerOptions): void {
    this.id = o.id;
    this.layout = o.layout;
    this.tooltip = o.tooltip;
    this.value = o.value;

    this.initHandler();
  }

  private updateTooltipValue(): void {
    this.UI.tooltip.textContent = this.value.toString(10);
  }
}

export default Handler;
