type Options = {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
}

interface Model {
  addObserver(o: Function): any;
  removeObserver(o: Function): any;
  notifyObservers(): any;
}

export default class RSModel implements Model {
  observers: Array<Function>;

  minValue: number;

  maxValue: number;

  stepSize: number;

  handlerCount: number;

  constructor(options: Options) {
    this.observers = [];

    this.minValue = options.minValue || 0;
    this.maxValue = options.minValue || 100;
    this.stepSize = options.stepSize || 10;
    this.handlerCount = options.handlerCount || 1;
  }

  addObserver(o: Function) {
    this.observers.push(o);
  }

  removeObserver(o: Function) {
    this.observers = this.observers.filter((fn) => {
      if (fn === o) {
        return fn;
      }
      return null;
    });
  }

  notifyObservers() {
    this.observers.forEach((o) => {
      // o.call();
      // (o)();
      o();
    });
  }
}
