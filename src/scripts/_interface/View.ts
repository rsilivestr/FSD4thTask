import ModelOptions from './ModelOptions';
import Presenter from './Presenter';
import ViewOptions from './ViewOptions';

export default interface View {
  container: HTMLElement;
  options: ViewOptions;
  presenter: Presenter;

  config(o?: ViewOptions): ViewOptions;
  setModelOptions(o: ModelOptions): ModelOptions;
  setValues(v: number[]): number[];
  render(): HTMLElement;
}
