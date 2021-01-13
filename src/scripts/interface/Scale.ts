import ModelOptions from './ModelOptions';
import Subject from './Subject';

export default interface Scale extends Subject {
  getElement: () => HTMLElement;
  toggleLayout: (layout: 'horizontal' | 'vertical') => void;
  setConfig: (o: ModelOptions) => void;
  setValues: (v: number[]) => void;
}
