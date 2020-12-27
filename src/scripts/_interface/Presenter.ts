import Model from './Model';
import Observer from './Observer';
import View from './View';

export default interface Presenter extends Observer {
  model: Model;
  view: View;

  getValues(): number[];
  setModelValue(index: number, value: number): number[];
}
