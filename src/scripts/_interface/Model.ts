import ModelOptions from './ModelOptions';
import Subject from './Subject';

export default interface Model extends Subject {
  options: ModelOptions;
  stepSizePerc: number;

  // updateHandlers(index: number, coord: number): number[];
  // updateValue(index: number, value: number): number;
  getValues(): number[];
  getOptions(): ModelOptions;
  setOptions(options: ModelOptions): ModelOptions;
}
