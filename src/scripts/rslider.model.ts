// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

interface ModelOptions {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
}

export default class RSModel implements Subject {
  observers: Observer[] = [];

  public options: ModelOptions = {};

  stepSizePerc;

  handlerValues: number[] = [];

  constructor(options?: ModelOptions) {
    this.options.minValue = options.minValue || 0;
    this.options.maxValue = options.minValue || 100;
    this.options.stepSize = options.stepSize || 10;
    this.options.handlerCount = options.handlerCount || 1;
    this.options.range = options.range || false;

    const scaleLength = this.options.maxValue - this.options.minValue;
    this.stepSizePerc = Math.abs((this.options.stepSize / scaleLength) * 100);

    this.handlerValues = this.setValues();
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

  notifyObservers(index) {
    this.observers.forEach((o) => {
      o.update(index, this.handlerValues[index]);
    });
  }

  getOptions() {
    return this.options;
  }

  setOptions(options: ModelOptions) {
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

  updateHandler(index, coord) {
    const x = coord + this.stepSizePerc / 2;

    let handlerValue = x - (x % this.stepSizePerc);

    if (handlerValue < 0) {
      handlerValue = 0;
    } else if (handlerValue > 100) {
      handlerValue = 100;
    }

    this.handlerValues[index] = handlerValue;

    this.notifyObservers(index);
  }

  // hardcoded starting values
  setValues() {
    const arr = [];

    arr.length = this.options.handlerCount;

    let index = 0;
    let value = 0;

    while (index < arr.length) {
      arr[index] = value;
      index += 1;
      value += this.stepSizePerc;
    }

    return arr;
  }
}
