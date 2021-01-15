export default interface Presenter {
  getValues(): number[];
  setModelValue(index: number, value: number): number;
}
