import Observer from './Observer';
import Subject from './Subject';

export default interface Panel extends Subject, Observer {
  // UI: {
  //   container: HTMLElement;
  //   panel: HTMLElement;
  // };
  // slider: Slider;
  // modelOptions: ModelOptions;
  // viewOptions: ViewOptions;
  // container: HTMLElement;
  // values: number[];
  // handlerInputs: HTMLInputElement[];
}
