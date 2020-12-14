import ModelOptions from './ModelOptions';
import Presenter from './Presenter';

export default interface Model {
  options: ModelOptions;
  presenter: Presenter;
  // stepSizePerc: number;

  config(o?: ModelOptions): ModelOptions;
  // updateHandlers(index: number, coord: number): number[];
  // updateValue(index: number, value: number): number;
  // getValues(): number[];
  // getOptions(): ModelOptions;
  // setOptions(options: ModelOptions): ModelOptions;
}
