import ModelOptions from './ModelOptions';
import Subject from './Subject';

export default interface Model extends Subject {
  options: ModelOptions;

  config(o?: ModelOptions): ModelOptions;
  // updateHandlers(index: number, coord: number): number[];
  // updateValue(index: number, value: number): number;
  getValue(index: number): number | null;
  getValues(): number[];
  setValue(index: number, v: number): number;
  setValues(v: number[]): number[];
  // getOptions(): ModelOptions;
  // setOptions(options: ModelOptions): ModelOptions;
}
