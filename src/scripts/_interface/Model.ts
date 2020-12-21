import ModelOptions from './ModelOptions';
import Presenter from './Presenter';
import Subject from './Subject';

export default interface Model extends Subject {
  options: ModelOptions;
  presenter: Presenter;
  // stepSizePerc: number;

  config(o?: ModelOptions): ModelOptions;
  // updateHandlers(index: number, coord: number): number[];
  // updateValue(index: number, value: number): number;
  getValue(index: number): number | null;
  getValues(): number[];
  setValueByCoord(id: number, coord: number): number;
  setValues(v: number[]): number[];
  // getOptions(): ModelOptions;
  // setOptions(options: ModelOptions): ModelOptions;
}
