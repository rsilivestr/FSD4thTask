import { TSubject } from './types';

class Subject implements TSubject {
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
