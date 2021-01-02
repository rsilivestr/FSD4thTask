import Subject from './Subject';

export default interface Scale extends Subject {
  getElement: () => HTMLElement;
}
