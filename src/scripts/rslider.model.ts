// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

interface ModelOptions {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
}

export default class RSModel implements Subject {
  observers: Observer[] = [];

  options: ModelOptions = {};

  handlerValues = [];

  constructor(options?: ModelOptions) {
    this.options.minValue = options.minValue || 0;
    this.options.maxValue = options.minValue || 100;
    this.options.stepSize = options.stepSize || 10;
    this.options.handlerCount = options.handlerCount || 1;
  }

  addObserver(o: Observer) {
    this.observers.push(o);
  }

  removeObserver(o: Observer) {
    this.observers = this.observers.filter((fn) => {
      if (fn === o) {
        return fn;
      }
      return null;
    });
  }

  notifyObservers(param) {
    this.observers.forEach((o) => {
      o.update(param);
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

  updateHandler(coord) {
    // hardcoded step size 10%
    const foo = coord + 10 / 2;
    const bar = foo - (foo % 10);

    this.handlerValues[0] = bar;
    this.notifyObservers(bar);
  }
}
