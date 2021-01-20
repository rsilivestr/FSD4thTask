import { ModelOptions, Model } from './interfaces';
import RSubject from './RSubject';

class RSModel extends RSubject implements Model {
  private directionMod: 1 | -1 = 1;

  private options: ModelOptions = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    handlerCount: 1,
    allowReversedValues: false,
  };

  private values: number[] = [];

  constructor(o: ModelOptions = {}) {
    super();

    this._initValues();
    // Set config
    this._configure(o);
    // this._configure(o);
  }

  public getConfig() {
    return this.options;
  }

  public setConfig(o?: ModelOptions) {
    return this._configure(o);
    // return this._configure(o);
  }

  public getValue(index: number) {
    return this.values[index];
  }

  public getValues() {
    // Get values array
    return this.values;
  }

  public setValue(index: number, value: number) {
    if (!RSModel._isNumber(index) || !RSModel._isNumber(value))
      throw new Error('Value and index should be numeric');

    const { minValue, maxValue, stepSize, handlerCount } = this.options;

    if (index < 0 || index >= handlerCount)
      throw new Error('There is no value with such index');

    // Get min and max allowed values for this handler index
    const min = minValue + index * stepSize * this.directionMod;
    const max = maxValue - (handlerCount - index - 1) * stepSize * this.directionMod;

    // Set value
    let val = 0;
    if (value * this.directionMod < min * this.directionMod) {
      val = min;
    } else if (value * this.directionMod > max * this.directionMod) {
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
    // ? TODO add validation

    this.values = v;

    return this.values;
  }

  private _configureDirection() {
    this.directionMod = this.options.maxValue > this.options.minValue ? 1 : -1;
  }

  private _configureMinValue(newMinValue: number) {
    const { maxValue, stepSize, handlerCount, allowReversedValues } = this.options;
    const minLength = stepSize * handlerCount;

    if (!allowReversedValues && newMinValue > maxValue) return;

    if (Math.abs(maxValue - newMinValue) >= minLength) {
      this.options.minValue = newMinValue;

      this._configureDirection();

      // Update values
      if (this.values) {
        this.values.forEach((value, index) => this.setValue(index, value));
      }
    }
  }

  private _configureMaxValue(newMaxValue: number) {
    const { minValue, stepSize, handlerCount, allowReversedValues } = this.options;
    const minLength = stepSize * handlerCount;

    if (!allowReversedValues && minValue > newMaxValue) return;

    if (Math.abs(newMaxValue - minValue) >= minLength) {
      this.options.maxValue = newMaxValue;

      this._configureDirection();

      // Update values
      if (this.values) {
        this.values.forEach((value, index) => this.setValue(index, value));
      }
    }
  }

  private _configureStepSize(newStepSize: number) {
    const { minValue, maxValue, handlerCount } = this.options;
    const sliderLength = Math.abs(maxValue - minValue);

    if (newStepSize > 0 && newStepSize <= sliderLength / handlerCount) {
      this.options.stepSize = newStepSize;

      if (this.values) {
        this.values.forEach((value, index) => this.setValue(index, value));
      }
    }
  }

  private _configureHandlerCount(newHandlerCount: number) {
    const { minValue, maxValue, stepSize } = this.options;
    const sliderLength = Math.abs(maxValue - minValue);
    const maxHandlerCount = Math.floor(sliderLength / stepSize);

    // Should be > 0 and lte maxHandlerCount
    if (newHandlerCount > 0 && newHandlerCount <= maxHandlerCount) {
      this.options.handlerCount = newHandlerCount;

      // Reset values when handerCount changes
      if (this.values.length !== newHandlerCount) this._initValues();
    }
  }

  private _configureSingleOption(key: string, value: number) {
    switch (key) {
      case 'minValue':
        this._configureMinValue(value);
        break;
      case 'maxValue':
        this._configureMaxValue(value);
        break;
      case 'stepSize':
        this._configureStepSize(value);
        break;
      case 'handlerCount':
        this._configureHandlerCount(value);
        break;
      default:
    }
  }

  private _configureFourOptions(o: ModelOptions) {
    const { minValue, maxValue, stepSize, handlerCount } = o;
    const { allowReversedValues } = this.options;

    if (!allowReversedValues && minValue > maxValue) return;

    if (stepSize === 0 || handlerCount === 0) return;

    const sliderLength = Math.abs(maxValue - minValue);
    const maxStepSize = sliderLength / handlerCount;

    if (stepSize > maxStepSize) return;

    // All good
    this.options = {
      minValue,
      maxValue,
      stepSize,
      handlerCount,
      allowReversedValues,
    };

    this._configureDirection();

    // Reset values when handerCount changes
    if (this.values.length !== handlerCount) this._initValues();

    // Update values to be in range and match stepSize
    this.values.forEach((value, index) => this.setValue(index, value));
  }

  private _configure(o: ModelOptions) {
    const validOptions: ModelOptions = {};

    const { allowReversedValues } = o;
    if (typeof allowReversedValues === 'boolean') {
      this.options.allowReversedValues = allowReversedValues;
    }

    // Strip non-numeric entries, save to new object
    // Mutating existing object will break view configuration
    Object.keys(o).forEach((key) => {
      if (RSModel._isNumber(o[key])) {
        validOptions[key] = o[key];
      }
    });

    const keys = Object.keys(validOptions);
    const len = keys.length;
    const firstKey = keys[0];
    const firstValue = validOptions[firstKey];

    // Allow either 1 or 4 options just yet
    switch (len) {
      case 1:
        this._configureSingleOption(firstKey, firstValue as number);
        break;
      // case 2:
      //   break;
      // case 3:
      //   break;
      case 4:
        this._configureFourOptions(validOptions);
        break;
      default:
        return this.options;
    }

    this.notifyObservers(this.values);

    return this.options;
  }

  private _initValues() {
    const { minValue, stepSize, handlerCount } = this.options;

    // Reset values (for case when handlerCount was changed)
    this.values = [];

    // Fill each step starting from minValue
    for (let i = 0; i < handlerCount; i += 1) {
      this.values[i] = minValue + i * stepSize;
    }
  }

  static _isNumber(n: any) {
    return !Number.isNaN(n) && Number.isFinite(n);
  }

  // Converts value multiple of stepSize
  private _normalizeValue(value: number): number {
    const { minValue, stepSize } = this.options;

    const x = value - minValue + (stepSize / 2) * this.directionMod;

    return Math.round(minValue + x - (x % stepSize));
  }

  private _updateValues(index: number, value: number) {
    const { stepSize } = this.options;

    this.values.forEach((v, i) => {
      // Minimum difference between value and v
      const minValueDiff = (i - index) * stepSize * this.directionMod;

      // Closest allowed v to value (at least one stepSize between adjacent values)
      const closestValue = value + minValueDiff;

      // Change v if closer to value than allowed
      if (i < index && v * this.directionMod > closestValue * this.directionMod) {
        this.values[i] = closestValue;
      } else if (i > index && v * this.directionMod < closestValue * this.directionMod) {
        this.values[i] = closestValue;
      }
    });

    this.notifyObservers(this.values);
  }
}

export default RSModel;
