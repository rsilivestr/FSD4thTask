import Model from './interface/Model';
import ModelOptions from './interface/ModelOptions';
import RSubject from './subject';

export default class RSModel extends RSubject implements Model {
  private options: ModelOptions = {};
  private values: number[] = [];

  constructor(o: ModelOptions = {}) {
    super();
    // Set config
    this._configure(o);
    // Set hander values
    this._initValues();
  }

  public notifyObservers: () => void = () => {
    this.observers.forEach((o) => o(this.values));
  };

  public config(o?: ModelOptions) {
    // Set config
    if (o) return this._configure(o);
    // Get config
    return this.options;
  }

  public getValue(index: number) {
    return this.values[index];
  }

  public getValues() {
    // Get values array
    return this.values;
  }

  public setValue(index: number, value: number) {
    const { minValue, maxValue, stepSize, handlerCount } = this.options;
    // Get min and max allowed values for this handler index
    const min = minValue + index * stepSize;
    const max = maxValue - (handlerCount - index - 1) * stepSize;
    // Set value
    let val = 0;
    if (value < min) {
      val = min;
    } else if (value > max) {
      val = max;
    } else {
      val = this._normalizeValue(value);
    }
    this.values[index] = val;
    // Update other values
    this._updateValues(index, val);

    return val;
  }

  public setValues(v: number[]) {
    // TODO add validation
    this.values = v;

    return this.values;
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

  private _initValues() {
    const { minValue, stepSize, handlerCount } = this.options;
    // Fill each step starting from minValue
    for (let i = 0; i < handlerCount; i += 1) {
      this.values[i] = minValue + i * stepSize;
    }
  }

  private _isNumber(n: number) {
    return typeof n === 'number' && !isNaN(n);
  }

  private _normalizeValue(value: number): number {
    const { minValue, stepSize } = this.options;
    // minValue added to work with negative values
    const x = value - minValue + stepSize / 2;
    return minValue + x - (x % stepSize);
  }

  private _updateValues(index: number, value: number) {
    const { stepSize } = this.options;

    this.values.forEach((v, i) => {
      // Minimum difference between value and v
      const minValueDiff = (i - index) * stepSize;
      // Closest allowed v to value (at least one stepSize between adjacent values)
      const closestValue = value + minValueDiff;

      // Change v if closer to value than allowed
      if (i < index && v > closestValue) {
        this.values[i] = closestValue;
      } else if (i > index && v < closestValue) {
        this.values[i] = closestValue;
      }
    });

    this.notifyObservers();
  }
}