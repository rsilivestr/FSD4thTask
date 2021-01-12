import Scale from './Scale';
import SliderOptions from './SliderOptions';

export default interface Slider {
  getContainer(): HTMLElement;
  addScale(): Scale;
  setConfig(o: SliderOptions): SliderOptions;
  getConfig(): SliderOptions;
  getValue(index?: number): number;
  setValue(index: number, value: number): number;
  getValues(): number[];
  setValues(values?: number[]): number[];
  addObserver(o: Function): void;
}
