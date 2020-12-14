import Observer from './_interface/Observer';
import Subject from './_interface/Subject';

export default class RSubject implements Subject {
  private observers: Observer[] = [];
  public values: number[];

  public addObserver(o: Observer) {
    this.observers.push(o);

    return this.observers;
  }

  public removeObserver(o: Observer): Observer[] {
    this.observers = this.observers.filter((fn) => fn !== o);

    return this.observers;
  }

  public notifyObservers(): void {
    this.observers.forEach((o) => o.update(this.values));
  }
}
