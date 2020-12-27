import Observer from './Observer';

export default interface Panel extends Observer {
  UI: {
    container: HTMLElement;
    panel: HTMLElement;
  };
  notifyPresenter: Function;
  // slider: Slider;
  // modelOptions: ModelOptions;
  // viewOptions: ViewOptions;
  // container: HTMLElement;
  // values: number[];
  // handlerInputs: HTMLInputElement[];
}
