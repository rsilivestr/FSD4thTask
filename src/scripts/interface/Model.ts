import ModelOptions from './ModelOptions';
import Subject from './Subject';

export default interface Model extends Subject {
  // options: ModelOptions;

  config(o?: ModelOptions): ModelOptions;
  getValue(index: number): number | null;
  getValues(): number[];
  setValue(index: number, v: number): number;
  setValues(v: number[]): number[];
}
