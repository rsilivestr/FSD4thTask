import ModelOptions from './ModelOptions';
import Observer from './Observer';
import Presenter from './Presenter';
import ViewOptions from './ViewOptions';

export default interface View extends Observer {
  container: HTMLElement;
  options: ViewOptions;
  presenter: Presenter;

  config(o?: ViewOptions): ViewOptions;
  setModelOptions(o: ModelOptions): ModelOptions;
  // setValues(v: number[]): number[];
  render(): HTMLElement;
}
