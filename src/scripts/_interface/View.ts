import ModelOptions from './ModelOptions';
import Scale from './Scale';
import Subject from './Subject';
import ViewOptions from './ViewOptions';

export default interface View extends Subject {
  container: HTMLElement;
  options: ViewOptions;
  values: number[];

  addScale(o: ModelOptions): Scale;
  config(o?: ViewOptions): ViewOptions;
  setModelOptions(o: ModelOptions): ModelOptions;
  setValues(v: number[]): void;
  render(): HTMLElement;
  update(): number[];
}
