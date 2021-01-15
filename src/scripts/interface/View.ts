import ModelOptions from './ModelOptions';
import Scale from './Scale';
import SliderOptions from './SliderOptions';
import Subject from './Subject';
import ViewOptions from './ViewOptions';

export default interface View extends Subject {
  addScale(o: ModelOptions): Scale;
  getConfig(): ViewOptions;
  setConfig(o: ViewOptions): ViewOptions;
  setModelOptions(o: SliderOptions): ModelOptions;
  setValues(v: number[]): void;
  update(): number[];
}
