// eslint-disable-next-line no-unused-vars
import { Subject, Observer } from './interfaces';

export interface ModelOptions {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
  changed?: boolean;
}

export interface Model extends Subject {
  observers: Observer[];
  options: ModelOptions;
  stepSizePerc: number;
  handlerValues: number[];

  updateHandlers(index: number, coord: number): number[];
  updateValue(index: number, value: number): number;
  getValues(): number[];
  getOptions(): ModelOptions;
  setOptions(options: ModelOptions): ModelOptions;
}

export default class RSModel implements Model {
  observers: Observer[] = [];

  public options: ModelOptions = {};

  stepSizePerc: number;

  handlerValues: number[] = [];

  constructor(options?: ModelOptions) {
    if (
      options.minValue !== undefined &&
      typeof options.minValue === 'number'
    ) {
      this.options.minValue = options.minValue;
    } else this.options.minValue = -50;

    if (
      options.maxValue !== undefined &&
      typeof options.maxValue === 'number'
    ) {
      this.options.maxValue = options.maxValue;
    } else this.options.maxValue = 50;

    this.options.stepSize = options.stepSize || 20;
    this.options.handlerCount = options.handlerCount || 1;
    this.options.range = options.range || false;

    this.stepSizePerc = this.updatePercentStep();

    this.handlerValues = this.presetValues();
  }

  public addObserver(o: Observer) {
    this.observers.push(o);

    return this.observers;
  }

  public removeObserver(o: Observer) {
    this.observers = this.observers.filter((fn) => {
      if (fn === o) {
        return fn;
      }
      return null;
    });

    return this.observers;
  }

  public notifyObservers() {
    this.observers.forEach((o) => {
      o.update(this.handlerValues);
    });

    this.options.changed = false;
  }

  // Convert coordinate (0-100%) to value
  private coordToValue(coord: number) {
    const { minValue, maxValue, stepSize } = this.options;

    if (coord < 0) return minValue;

    if (coord > 100) return maxValue;

    const factor = stepSize / this.stepSizePerc;
    const value = coord * factor + minValue;

    return Math.round(value);
  }

  // Convert value to coordinate (0-100%)
  private valueToCoord(value: number) {
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

  // Set percentage based stepSize
  private updatePercentStep() {
    const scaleLength = Math.abs(this.options.maxValue - this.options.minValue);
    const stepPerc = (this.options.stepSize / scaleLength) * 100;
    this.stepSizePerc = stepPerc;

    return stepPerc;
  }

  // Return coordinate of the closest step,
  // take into account max value of each handler
  private normalizeHandlerCoord(index: number, coord: number): number {
    if (typeof index !== 'number' || typeof coord !== 'number') {
      // throw new Error('RSModel.normalizeHandlerCoord: wrong params');
      return;
    }

    const step = this.updatePercentStep();
    const x = coord + step / 2;
    const normalizedCoord = x - (x % step);

    const stepsToMax = this.handlerValues.length - (index + 1);
    // min coordinate by index
    const minIndexCoord = step * index;
    // if last step is smaller scaleLength (percent) is extended to be multiple of stepSize
    const scaleLength = Math.abs(this.options.maxValue - this.options.minValue);
    const correctedLength =
      100 + ((scaleLength % this.options.stepSize) / scaleLength) * 100;
    // max coordinate by index
    const maxIndexCoord = correctedLength - step * stepsToMax;

    // if coordinate exeeds allowed max for index
    if (normalizedCoord > maxIndexCoord) return maxIndexCoord;

    // if coordinate is less than allowed min for index
    if (normalizedCoord < minIndexCoord) return minIndexCoord;

    // if coordinate is in allowed range
    return normalizedCoord;
  }

  // used by RSController
  public updateHandlers(index: number, coord: number) {
    // method should only accept numbers
    if (
      typeof index !== 'number' ||
      isNaN(index) ||
      typeof coord !== 'number' ||
      isNaN(coord)
    ) {
      return this.handlerValues;
    }

    const normalizedCoord = this.normalizeHandlerCoord(index, coord);
    const normalizedValue = this.coordToValue(normalizedCoord);

    // set handler value
    this.handlerValues[index] = normalizedValue;

    const values = this.handlerValues;

    // move other handlers if needed
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

  private postUpdate(idx?: number) {
    this.stepSizePerc = this.updatePercentStep();

    if (idx) {
      const value: number = this.handlerValues[idx];
      const coord: number = this.valueToCoord(value);
      this.updateHandlers(idx, coord);
    } else {
      // change handlerValues according to handlerCount
      this.handlerValues.length = this.options.handlerCount;

      this.handlerValues.forEach((value, index) => {
        const coord: number = this.valueToCoord(value);
        this.updateHandlers(index, coord);
      });
    }

    return this.handlerValues;
  }

  // used by RSPanel
  public updateValue(index: number, value: number) {
    const { minValue, maxValue, stepSize } = this.options;

    let normalizedValue;

    if (value < minValue) {
      normalizedValue = minValue;
    } else if (value > maxValue) {
      normalizedValue = maxValue;
    } else {
      const val = value - minValue;
      const x = val + stepSize / 2;
      normalizedValue = x - (x % stepSize) + minValue;
    }

    this.handlerValues[index] = normalizedValue;

    this.postUpdate(index);

    return normalizedValue;
  }

  // set starting values
  private presetValues() {
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

  public getValues() {
    return this.handlerValues;
  }

  public getOptions() {
    return this.options;
  }

  // validate and apply provided options
  public setOptions(options: ModelOptions) {
    const { handlerCount, minValue, maxValue, stepSize, range } = options;

    // tells observers that options were changed
    let changed: boolean = false;

    if (
      typeof handlerCount === 'number' &&
      !isNaN(handlerCount) &&
      handlerCount !== this.options.handlerCount
    ) {
      this.options.handlerCount = handlerCount;
      changed = true;
      // reset handler values
      this.handlerValues = this.presetValues();
    }

    if (
      typeof minValue === 'number' &&
      !isNaN(minValue) &&
      minValue !== this.options.minValue
    ) {
      this.options.minValue = minValue;
      changed = true;
    }

    if (
      typeof maxValue === 'number' &&
      !isNaN(maxValue) &&
      maxValue !== this.options.maxValue
    ) {
      this.options.maxValue = maxValue;
      changed = true;
    }

    if (
      typeof stepSize === 'number' &&
      !isNaN(stepSize) &&
      stepSize !== this.options.stepSize
    ) {
      this.options.stepSize = stepSize;
      changed = true;
    }

    if (typeof range === 'boolean' && range !== this.options.range) {
      this.options.range = range;
      changed = true;
    }

    if (changed) {
      this.options.changed = true;
      this.postUpdate();
    }

    return this.options;
  }
}
