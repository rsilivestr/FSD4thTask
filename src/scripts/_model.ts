import Model from './_interface/Model';
import ModelOptions from './_interface/ModelOptions';
import Presenter from './_interface/Presenter';
import RSubject from './_subject';

export default class RSModel extends RSubject implements Model {
  public options: ModelOptions = {};
  public presenter: Presenter;
  public values: number[] = [];
  private stepSizePerc: number;

  constructor(o: ModelOptions, v: number[] = []) {
    super();
    // Set config
    this._configure(o);
    // Set hander values
    this._initValues(v);
  }

  private _isNumber(n: number) {
    return typeof n === 'number' && !isNaN(n);
  }

  private _configure(o: ModelOptions) {
    const { minValue, maxValue, stepSize, handlerCount } = o;

    if (
      // Number
      this._isNumber(minValue) &&
      // which is not equal to min
      minValue !== maxValue &&
      // and, if no new max provided, not equal to existing max
      !(maxValue === undefined && minValue === this.options.maxValue)
    ) {
      this.options.minValue = minValue;
    } else if (this.options.minValue === undefined) {
      this.options.minValue = maxValue !== 0 ? 0 : -100;
    }

    if (
      // Number
      this._isNumber(maxValue) &&
      // which is not equal to min
      maxValue !== minValue &&
      // and, if no new min provided, not equal to existing min
      !(minValue === undefined && maxValue === this.options.minValue)
    ) {
      this.options.maxValue = maxValue;
    } else if (this.options.maxValue === undefined) {
      this.options.maxValue = minValue !== 100 ? 100 : 200;
    }

    if (this._isNumber(stepSize) && stepSize > 0) {
      this.options.stepSize = stepSize;
    } else if (this.options.stepSize === undefined) {
      this.options.stepSize = 10;
    }

    if (this._isNumber(handlerCount) && handlerCount > 0) {
      this.options.handlerCount = handlerCount;
    } else if (this.options.handlerCount === undefined) {
      this.options.handlerCount = 1;
    }

    return this.options;
  }

  private _initValues(v: number[]) {
    const len = v.length;
    const { minValue, stepSize, handlerCount } = this.options;
    if (len === 0) {
      // Array is empty: fill each step starting from minValue
      for (let i = 0; i < handlerCount; i += 1) {
        this.values[i] = minValue + i * stepSize;
      }
    } else {
      // Set values
      this.values = v;
    }
  }

  private _updatePercentStep() {
    const scaleLength = this.options.maxValue - this.options.minValue;
    this.stepSizePerc = (this.options.stepSize / scaleLength) * 100;

    return this.stepSizePerc;
  }

  // Return coordinate of the closest step,
  // take into account max value of each handler
  private _normalizeHandlerCoord(index: number, coord: number): number {
    if (typeof index !== 'number' || typeof coord !== 'number') {
      // throw new Error('RSModel._normalizeHandlerCoord: wrong params');
      return;
    }

    const step = Math.abs(this._updatePercentStep());
    const x = coord + step / 2;
    const normalizedCoord = x - (x % step);

    const stepsToMax = this.values.length - (index + 1);
    // min coordinate by index
    const minIndexCoord = step * index;
    // if last step is smaller than normal scaleLength (percent) is extended to be multiple of stepSize
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

  private _coordToValue(coord: number) {
    const { minValue, maxValue, stepSize } = this.options;

    if (coord < 0) return minValue;

    if (coord > 100) return maxValue;

    const factor = stepSize / this.stepSizePerc;
    const value = coord * factor + minValue;

    return Math.round(value);
  }

  private _updateValues(index: number, value: number) {
    const { stepSize } = this.options;

    this.values.forEach((v, i) => {
      if (i < index && v >= value) {
        this.values[i] = value - stepSize;
      } else if (i > index && v <= value) {
        this.values[i] = value + stepSize;
      }
    });

    this.notifyObservers();
  }

  public config(o?: ModelOptions) {
    // Set config
    if (o) return this._configure(o);
    // Get config
    return this.options;
  }

  public setValueByCoord(id: number, coord: number) {
    // Get coord
    const normalizedCoord = this._normalizeHandlerCoord(id, coord);
    // Get value
    const value = this._coordToValue(normalizedCoord);
    // Set value
    this.values[id] = value;
    // Move other handlers if needed
    this._updateValues(id, value);

    return normalizedCoord;
  }

  public setValues(v: number[]) {
    this.values = v;

    return this.values;
  }

  public getValues() {
    // Get values array
    return this.values;
  }

  public getValue(id: number) {
    return this.values[id] || null;
  }

  public notify() {}
}
