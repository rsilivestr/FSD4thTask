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
    this.options.minValue = options.minValue || -20;
    this.options.maxValue = options.maxValue || 60;
    this.options.stepSize = options.stepSize || 10;
    this.options.handlerCount = options.handlerCount || 1;
    this.options.range = options.range || false;

    const scaleLength = this.options.maxValue - this.options.minValue;
    this.stepSizePerc = Math.abs((this.options.stepSize / scaleLength) * 100);

    this.handlerValues = this.presetValues();

    // this.handlerCoords = this.setCoords();
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

  postUpdate(idx?: number) {
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

  getOptions() {
    return this.options;
  }

  setOptions(options: ModelOptions) {
    const count = +options.handlerCount;
    if (count && typeof count === 'number') {
      this.options.handlerCount = count;
    }

    const min = +options.minValue;
    if (min && typeof min === 'number') {
      this.options.minValue = min;
    }

    const max = +options.maxValue;
    if (max && typeof max === 'number') {
      this.options.maxValue = max;
    }

    const step = +options.stepSize;
    if (step && typeof step === 'number') {
      this.options.stepSize = step;
    }

    const { range } = options;
    if (range && typeof range === 'boolean') {
      this.options.range = range;
    }

    this.postUpdate();

    return this.options;
  }

  updatePercentStep() {
    const scaleLength = this.options.maxValue - this.options.minValue;
    const stepPerc = Math.abs((this.options.stepSize / scaleLength) * 100);
    this.stepSizePerc = stepPerc;

    return stepPerc;
  }

  normalizeHandlerCoord(index: number, coord: number) {
    const step = this.updatePercentStep();
    // value is a coordinate
    const x = coord + step / 2;
    // normalized value is coordinate of the closest step value
    const normalizedCoord = x - (x % step);

    const stepsToMax = this.handlerValues.length - (index + 1);
    // theese are percentage coords too
    const minIndexCoord = step * index;
    const maxIndexCoord = 100 - step * stepsToMax;

    if (normalizedCoord > maxIndexCoord) {
      return maxIndexCoord;
    }
    if (normalizedCoord < minIndexCoord) {
      return minIndexCoord;
    }
    return normalizedCoord;
  }

  coordToValue(coord: number) {
    const { minValue, stepSize } = this.options;
    const factor = stepSize / this.stepSizePerc;
    const value = coord * factor + minValue;
    return Math.round(value);
  }

  valueToCoord(value: number) {
    const { minValue, stepSize } = this.options;
    const steps = (value - minValue) / stepSize;
    const coord = steps * this.stepSizePerc;
    return coord;
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

    return this.handlerValues;
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

  updateValue(index: number, value: number) {
    const step: number = this.options.stepSize;
    const x: number = value > 0 ? value + step / 2 : value - step / 2;
    const normalizedValue: number = x - (x % step);
    this.handlerValues[index] = normalizedValue;

    this.postUpdate(index);

    return normalizedValue;
  }
}
