// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

export interface ModelOptions {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
}

export interface Model extends Subject {
  observers: Observer[];
  options: ModelOptions;
  stepSizePerc: number;
  handlerValues: number[];

  postUpdate(): number[];
  getOptions(): ModelOptions;
  setOptions(options: ModelOptions): ModelOptions;
  updatePercentStep(): number;
  normalizeHandlerCoord(index: number, coord: number): number;
  coordToValue(coord: number): number;
  valueToCoord(value: number): number;
  updateHandlers(index: number, coord: number): number[];
  presetValues(): number[];
  updateValue(index: number, value: number): number;
}

export default class RSModel implements Model {
  observers: Observer[] = [];

  public options: ModelOptions = {};

  stepSizePerc: number;

  handlerValues: number[] = [];

  constructor(options?: ModelOptions) {
    this.options.minValue = options.minValue || -50;
    this.options.maxValue = options.maxValue || 50;
    this.options.stepSize = options.stepSize || 20;
    this.options.handlerCount = options.handlerCount || 1;
    this.options.range = options.range || false;

    this.stepSizePerc = this.updatePercentStep();

    this.handlerValues = this.presetValues();
  }

  addObserver(o: Observer) {
    this.observers.push(o);

    return this.observers;
  }

  removeObserver(o: Observer) {
    this.observers = this.observers.filter((fn) => {
      if (fn === o) {
        return fn;
      }
      return null;
    });

    return this.observers;
  }

  notifyObservers() {
    this.observers.forEach((o) => {
      o.update(this.handlerValues);
    });
  }

  coordToValue(coord: number) {
    const { minValue, maxValue, stepSize } = this.options;

    if (coord < 0) {
      return minValue;
    }

    if (coord > 100) {
      return maxValue;
    }

    const factor = stepSize / this.stepSizePerc;
    const value = coord * factor + minValue;

    return Math.round(value);
  }

  valueToCoord(value: number) {
    const { minValue, maxValue, stepSize } = this.options;

    if (value < minValue) {
      return 0;
    }

    if (value > maxValue) {
      return 100;
    }

    const steps = (value - minValue) / stepSize;
    const coord = steps * this.stepSizePerc;
    return coord;
  }

  updatePercentStep() {
    const scaleLength = this.options.maxValue - this.options.minValue;
    const stepPerc = Math.abs((this.options.stepSize / scaleLength) * 100);
    this.stepSizePerc = stepPerc;

    return stepPerc;
  }

  normalizeHandlerCoord(index: number, coord: number) {
    if (typeof index !== 'number' || typeof coord !== 'number') {
      throw new Error('RSModel.normalizeHandlerCoord: wrong params');
    }

    const step = this.updatePercentStep();
    const x = coord + step / 2;
    const normalizedCoord = x - (x % step);

    const stepsToMax = this.handlerValues.length - (index + 1);
    const minIndexCoord = step * index;
    const maxIndexCoord = 100 - step * stepsToMax;

    if (normalizedCoord > maxIndexCoord) return maxIndexCoord;

    if (normalizedCoord < minIndexCoord) return minIndexCoord;

    return normalizedCoord;
  }

  updateHandlers(index: number, coord: number) {
    const normalizedCoord = this.normalizeHandlerCoord(index, coord);
    const normalizedValue = this.coordToValue(normalizedCoord);

    this.handlerValues[index] = normalizedValue;

    const values = this.handlerValues;

    for (let idx = 0; idx < values.length; idx += 1) {
      const val = values[idx];

      let newValue = normalizedValue;
      let newCoord = normalizedCoord;

      if (idx === index + 1 && val <= normalizedValue) {
        newValue = normalizedValue + this.options.stepSize;
        newCoord = normalizedCoord + this.stepSizePerc;
        this.handlerValues[idx] = newValue;
        this.updateHandlers(idx, newCoord);
      } else if (idx === index - 1 && val >= normalizedValue) {
        newValue = normalizedValue - this.options.stepSize;
        newCoord = normalizedCoord - this.stepSizePerc;
        this.handlerValues[idx] = newValue;
        this.updateHandlers(idx, newCoord);
      }
    }

    this.notifyObservers();

    // this.postUpdate(); throws 'Too much recursion'

    return this.handlerValues;
  }

  postUpdate(idx?: number) {
    this.stepSizePerc = this.updatePercentStep();

    if (idx) {
      const value: number = this.handlerValues[idx];
      const coord: number = this.valueToCoord(value);
      this.updateHandlers(idx, coord);
    } else {
      this.handlerValues.forEach((value, index) => {
        const coord: number = this.valueToCoord(value);
        this.updateHandlers(index, coord);
      });
    }

    this.notifyObservers();

    return this.handlerValues;
  }

  updateValue(index: number, value: number) {
    const { minValue, maxValue, stepSize } = this.options;

    if (value < minValue) return minValue;

    if (value > maxValue) return maxValue;

    const val = value - minValue;
    const x = val + stepSize / 2;
    const normalizedValue = x - (x % stepSize) + minValue;
    this.handlerValues[index] = normalizedValue;

    this.postUpdate(index);

    return normalizedValue;
  }

  // starting values are hardcoded
  presetValues() {
    const arr: number[] = [];

    arr.length = this.options.handlerCount;

    let index: number = 0;
    let value: number = this.options.minValue;

    while (index < arr.length) {
      arr[index] = value;
      index += 1;
      value += this.options.stepSize;
    }

    return arr;
  }

  getOptions() {
    return this.options;
  }

  setOptions(options: ModelOptions) {
    const {
      handlerCount,
      minValue,
      maxValue,
      stepSize,
      range,
    } = options;

    if (typeof handlerCount === 'number' && handlerCount !== 0) {
      this.options.handlerCount = handlerCount;
    }

    if (typeof minValue === 'number') {
      this.options.minValue = minValue;
    }

    if (typeof maxValue === 'number') {
      this.options.maxValue = maxValue;
    }

    if (stepSize && typeof stepSize === 'number') {
      this.options.stepSize = stepSize;
    }

    if (range && typeof range === 'boolean') {
      this.options.range = range;
    }

    this.postUpdate();

    return this.options;
  }
}
