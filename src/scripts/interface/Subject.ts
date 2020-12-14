import Observer from './Observer';

export default interface Subject {
  addObserver(o: Observer): Observer[];
  removeObserver(o: Observer): Observer[];
  notifyObservers(): void;
}
