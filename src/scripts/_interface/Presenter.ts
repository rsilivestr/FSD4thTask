import Model from './Model';
import Observer from './Observer';
import View from './View';

export default interface Presenter {
  model: Model;
  view: View;

  addSender(s: Observer): void;
  getValues(): number[];
  setModelValue(index: number, value: number): number[];
}
