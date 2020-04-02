export interface ModelOptions {
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

  options: ModelOptions = {};

  constructor(options?: ModelOptions) {
    this.observers = [];

    this.options.minValue = options.minValue || 0;
    this.options.maxValue = options.minValue || 100;
    this.options.stepSize = options.stepSize || 10;
    this.options.handlerCount = options.handlerCount || 1;
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

  getOptions() {
    return this.options;
  }

  setOptions(options: ModelOptions) {
    // this.options.minValue = options.minValue || this.options.minValue;
    // this.options.maxValue = options.maxValue || this.options.maxValue;
    // this.options.stepSize = options.stepSize || this.options.stepSize;
    // this.options.handlerCount = options.handlerCount || this.options.handlerCount;

    // for (const { key, value } of Object.entries(options)) {
    //   this.options[key] = value;
    // }

    // for (const key in options) {
    //   if ({}.hasOwnProperty.call(options, key)) {
    //     this.options[key] = options[key];
    //   }
    // }

    Object.keys(options).forEach((key) => {
      this.options[key] = options[key];
    });
  }
}
