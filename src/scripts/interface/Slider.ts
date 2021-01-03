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
  config(o?: SliderOptions): SliderOptions;
  notifyModelObservers(): void;
  value(i: number, v?: number): number;
  values(v?: number[]): number[];
}
