// import HandlerOptions from './HandlerOptions';

export default interface Handler {
  getElement(): HTMLElement;
  setPosition(coord: number): void;
  updateValue(value: number): void;
}
