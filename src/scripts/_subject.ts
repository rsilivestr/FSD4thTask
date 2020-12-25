import Subject from './_interface/Subject';

export default class RSubject implements Subject {
  private observers: Function[] = [];
  public values: number[];

  public addObserver(o: Function) {
    this.observers.push(o);

    return this.observers;
  }

  public removeObserver(o: Function): Function[] {
    this.observers = this.observers.filter((fn) => fn !== o);

    return this.observers;
  }

  public notifyObservers(): void {
    this.observers.forEach((o) => o(this.values));
  }
}
