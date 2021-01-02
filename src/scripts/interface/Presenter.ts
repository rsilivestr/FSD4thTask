import Observer from './Observer';

export default interface Presenter extends Observer {
  getValues(): number[];
  setModelValue(index: number, value: number): number;
}
