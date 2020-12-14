import Presenter from './Presenter';
import Model from './Model';
import SliderOptions from './SliderOptions';
import View from './View';

export default interface Slider {
  readonly el: HTMLElement;
  readonly model: Model;
  readonly view: View;
  readonly presenter: Presenter;

  // getOptions(): SliderOptions;
  // setOptions(options: SliderOptions): SliderOptions;
  config(o?: SliderOptions): SliderOptions;
  // getValue(index: number): number;
  // getValues(): number[];
  // setValue(value: number, index: number): number;
  // addPanel(): Panel;
  // addScale(): Scale;
}
