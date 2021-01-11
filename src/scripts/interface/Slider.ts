import Model from './Model';
import Presenter from './Presenter';
import Scale from './Scale';
import SliderOptions from './SliderOptions';
import View from './View';

export default interface Slider {
  readonly el: HTMLElement;
  readonly model: Model;
  readonly view: View;
  readonly presenter: Presenter;

  addModelObserver(o: Function): void;
  addScale(): Scale;
  setConfig(o: SliderOptions): SliderOptions;
  getConfig(): SliderOptions;
  notifyModelObservers(): void;
  getValue(index?: number): number;
  setValue(index: number, value: number): number;
  getValues(): number[];
  setValues(values?: number[]): number[];
}
