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

  notifyObservers() {
    this.observers.forEach((o) => {
      o.update(this.handlerValues);
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

  normalizeHandlerValue(index, value) {
    const x = value + this.stepSizePerc / 2;
    const stepValue = x - (x % this.stepSizePerc);

    const stepsToMax = this.handlerValues.length - (index + 1);
    const maxIndexValue = this.options.maxValue - this.stepSizePerc * stepsToMax;
    const minIndexValue = this.options.minValue + this.stepSizePerc * index;

    if (stepValue > maxIndexValue) {
      return maxIndexValue;
    }
    if (stepValue < minIndexValue) {
      return minIndexValue;
    }
    return stepValue;
  }

  updateHandlers(index, value) {
    const normalizedValue = this.normalizeHandlerValue(index, value);

    this.handlerValues[index] = normalizedValue;

    const values = this.handlerValues;

    for (let idx = 0; idx < values.length; idx += 1) {
      const val = values[idx];

      let newValue = normalizedValue;

      if (idx === index + 1 && val <= normalizedValue) {
        newValue = normalizedValue + this.stepSizePerc;
        values[idx] = newValue;
        this.updateHandlers(idx, newValue);
      } else if (idx === index - 1 && val >= normalizedValue) {
        newValue = normalizedValue - this.stepSizePerc;
        values[idx] = newValue;
        this.updateHandlers(idx, newValue);
      }
    }

    this.notifyObservers();
  }

  // starting values are hardcoded
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
