import ModelOptions from './ModelOptions';
import ViewOptions from './ViewOptions';

export default interface View {
  container: HTMLElement;
  options: ViewOptions;
  values: number[];

  config(o?: ViewOptions): ViewOptions;
  setModelOptions(o: ModelOptions): ModelOptions;
  setValues(v: number[]): void;
  render(): HTMLElement;
  update(): number[];
  notifyPresenter: Function;
}
