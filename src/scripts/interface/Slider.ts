import Controller from './Controller';
import Model from './Model';
import Panel from './Panel';
import Scale from './Scale';
import SliderOptions from './SliderOptions';
import View from './View';

export default interface Slider {
  readonly container: HTMLElement;
  readonly model: Model;
  readonly view: View;
  readonly controller: Controller;

  getOptions(): SliderOptions;
  setOptions(options: SliderOptions): SliderOptions;
  getValue(index: number): number;
  getValues(): number[];
  setValue(value: number, index: number): number;
  addPanel(): Panel;
  addScale(): Scale;
}
