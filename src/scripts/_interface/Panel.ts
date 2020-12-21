// import ModelOptions from './ModelOptions';
import Observer from './Observer';
// import Slider from './Slider';
// import ViewOptions from './ViewOptions';

export default interface Panel extends Observer {
  UI: {
    container: HTMLElement;
    panel: HTMLElement;
  };
  // slider: Slider;
  // modelOptions: ModelOptions;
  // viewOptions: ViewOptions;
  // container: HTMLElement;
  // values: number[];
  // handlerInputs: HTMLInputElement[];
}
