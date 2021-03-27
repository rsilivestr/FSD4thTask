import * as types from './types';

class Subject implements types.Subject {
  protected observers: Function[] = [];

  public addObserver(o: Function) {
    this.observers.push(o);

    return this.observers;
  }

  public removeObserver(o: Function): Function[] {
    this.observers = this.observers.filter((fn) => fn !== o);

    return this.observers;
  }

  public notifyObservers(...data: any) {
    this.observers.forEach((o) => o(...data));
  }
}

export default Subject;
