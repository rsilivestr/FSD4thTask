import Subject from './interface/Subject';

export default class RSubject implements Subject {
  protected observers: Function[] = [];

  public addObserver(o: Function) {
    this.observers.push(o);

    return this.observers;
  }

  public removeObserver(o: Function): Function[] {
    this.observers = this.observers.filter((fn) => fn !== o);

    return this.observers;
  }

  public notifyObservers: Function;
}
