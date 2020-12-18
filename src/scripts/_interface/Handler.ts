import HandlerOptions from './HandlerOptions';

export default interface Handler extends HandlerOptions {
  UI: { handler: HTMLElement; tooltip: HTMLElement };

  updateValue(value: number): void;
  getElement(): HTMLElement;
  setPosition(coord: number): void;
}
