export default interface Subject {
  addObserver(o: Function): Function[];
  removeObserver(o: Function): Function[];
  notifyObservers(): void;
}
