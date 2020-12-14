import ModelOptions from './ModelOptions';
import Observer from './Observer';
import Subject from './Subject';

export default interface Model extends Subject {
  observers: Observer[];
  options: ModelOptions;
  stepSizePerc: number;
  handlerValues: number[];

  updateHandlers(index: number, coord: number): number[];
  updateValue(index: number, value: number): number;
  getValues(): number[];
  getOptions(): ModelOptions;
  setOptions(options: ModelOptions): ModelOptions;
}
