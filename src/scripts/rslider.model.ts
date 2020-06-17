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

  // coordToValue(coord: number): number;
  // valueToCoord(value: number): number;
  // updatePercentStep(): number;
  // normalizeHandlerCoord(index: number, coord: number): number;
  updateHandlers(index: number, coord: number): number[];
  // postUpdate(): number[];
  updateValue(index: number, value: number): number;
  presetValues(): number[];
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
    if (options.minValue !== undefined && typeof options.minValue === 'number') {
      this.options.minValue = options.minValue;
    } else this.options.minValue = -50;

    if (options.maxValue !== undefined && typeof options.maxValue === 'number') {
      this.options.maxValue = options.maxValue;
    } else this.options.maxValue = 50;

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

    this.options.changed = false;
  }

  private coordToValue(coord: number) {
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

  private updatePercentStep() {
    const scaleLength = Math.abs(this.options.maxValue - this.options.minValue);
    const stepPerc = (this.options.stepSize / scaleLength) * 100;
    this.stepSizePerc = stepPerc;

    return stepPerc;
  }

  private normalizeHandlerCoord(index: number, coord: number) {
    if (typeof index !== 'number' || typeof coord !== 'number') {
      throw new Error('RSModel.normalizeHandlerCoord: wrong params');
    }

    const step = this.updatePercentStep();
    const x = coord + step / 2;
    const normalizedCoord = x - (x % step);

    const stepsToMax = this.handlerValues.length - (index + 1);
    const minIndexCoord = step * index;
    // if last step is smaller scaleLength (percent) is extended to be multiple of stepSize
    const scaleLength = Math.abs(this.options.maxValue - this.options.minValue);
    const correctedLength = 100 + ((scaleLength % this.options.stepSize) / scaleLength) * 100;
    const maxIndexCoord = correctedLength - step * stepsToMax;

    if (normalizedCoord > maxIndexCoord) return maxIndexCoord;

    if (normalizedCoord < minIndexCoord) return minIndexCoord;

    return normalizedCoord;
  }

  // used by RSController
  public updateHandlers(index: number, coord: number) {
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

  private postUpdate(idx?: number) {
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

    // this.notifyObservers();

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

  public getValues() {
    return this.handlerValues;
  }

  public getOptions() {
    return this.options;
  }

  public setOptions(options: ModelOptions) {
    const {
      handlerCount,
      minValue,
      maxValue,
      stepSize,
      range,
    } = options;

    let changed: boolean = false;

    if (typeof handlerCount === 'number' && handlerCount !== this.options.handlerCount) {
      this.options.handlerCount = handlerCount;
      changed = true;
    }

    if (typeof minValue === 'number' && minValue !== this.options.minValue) {
      this.options.minValue = minValue;
      changed = true;
    }

    if (typeof maxValue === 'number' && maxValue !== this.options.maxValue) {
      this.options.maxValue = maxValue;
      changed = true;
    }

    if (typeof stepSize === 'number' && stepSize !== this.options.stepSize) {
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
