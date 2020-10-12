export interface Subject {
  addObserver(o: Observer): Observer[];
  removeObserver(o: Observer): Observer[];
  notifyObservers(): void;
}

export interface Observer {
  update(handlerValuesArray: number[]): any;
}
