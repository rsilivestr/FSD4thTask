export interface Subject {
  addObserver(o: Observer);
  removeObserver(o: Observer);
  notifyObservers(index);
}

export interface Observer {
  update(index, coord);
}
