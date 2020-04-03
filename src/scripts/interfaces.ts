export interface Subject {
  addObserver(o: Observer);
  removeObserver(o: Observer);
  notifyObservers(param);
}

export interface Observer {
  update(param);
}
