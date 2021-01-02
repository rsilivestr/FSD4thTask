export default interface Handler {
  getElement(): HTMLElement;
  setPosition(coord: number): void;
  toggleTooltip(value?: boolean): boolean;
  updateValue(value: number): void;
}
