export interface Subject {
  addObserver(o: Observer): Observer[];
  removeObserver(o: Observer): Observer[];
  notifyObservers(): any;
}

export interface Observer {
  update(handlerValuesArray: number[]): any;
}
