import Model from './Model';
import Panel from './Panel';
import Presenter from './Presenter';
import Scale from './Scale';
import SliderOptions from './SliderOptions';
import View from './View';

export default interface Slider {
  readonly el: HTMLElement;
  readonly model: Model;
  readonly view: View;
  readonly presenter: Presenter;

  config(o?: SliderOptions): SliderOptions;
  // setValues(values: number[]): void;
  // getValues(): number[];
  value(v: number): number;
  values(v: number[]): number[];
  addPanel(): Panel;
  addScale(): Scale;
}
