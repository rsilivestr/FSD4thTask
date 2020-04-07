export interface Subject {
  addObserver(o: Observer);
  removeObserver(o: Observer);
  notifyObservers();
}

export interface Observer {
  update(handlerValuesArray);
}
