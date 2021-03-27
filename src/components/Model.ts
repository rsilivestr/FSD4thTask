import Subject from './Subject';
import * as types from './types';

class Model extends Subject implements types.Model {
  private directionMod: 1 | -1 = 1;

  private options: types.ModelOptions = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    handlerCount: 1,
    allowReversedValues: false,
  };

  private values: number[] = [];

  constructor(o: types.ModelOptions = {}) {
    super();

    this.initValues();
    this.configure(o);
  }

  public getConfig() {
    return this.options;
  }

  public setConfig(o?: types.ModelOptions) {
    return this.configure(o);
  }

  public getValue(index: number) {
    return this.values[index];
  }

  public getValues() {
    return this.values;
  }

  public setValue(index: number, value: number) {
    const indexOrValueIsNotNumeric = !Model.isNumber(index) || !Model.isNumber(value);
    if (indexOrValueIsNotNumeric) throw new Error('Value and index should be numeric');

    const { minValue, maxValue, stepSize, handlerCount } = this.options;

    const indexIsOutOfRange = index < 0 || index >= handlerCount;
    if (indexIsOutOfRange) throw new Error('There is no value with such index');

    const min = minValue + index * stepSize * this.directionMod;
    const max = maxValue - (handlerCount - index - 1) * stepSize * this.directionMod;

    let val = 0;
    const valueIsBelowMin = value * this.directionMod < min * this.directionMod;
    const valueIsAboveMax = value * this.directionMod > max * this.directionMod;
    if (valueIsBelowMin) {
      val = min;
    } else if (valueIsAboveMax) {
      val = max;
    } else {
      val = this.normalizeValue(value);
    }

    this.values[index] = val;

    this.updateValues(index, val);

    return val;
  }

  public setValues(v: number[]) {
    this.values = v;

    return this.values;
  }

  private setEachValue() {
    if (!this.values) return;

    this.values.forEach((value, index) => this.setValue(index, value));
  }

  private configureDirection() {
    const maxIsGreaterThanMin = this.options.maxValue > this.options.minValue;
    this.directionMod = maxIsGreaterThanMin ? 1 : -1;
  }

  private configureMinValue(newMinValue: number) {
    const { maxValue, stepSize, handlerCount, allowReversedValues } = this.options;
    const minLength = stepSize * handlerCount;

    const newMinOutOfRange = !allowReversedValues && newMinValue > maxValue;
    const newMinTooCloseToMax = Math.abs(maxValue - newMinValue) < minLength;
    const newMinIsInvalid = newMinOutOfRange || newMinTooCloseToMax;
    if (newMinIsInvalid) return;

    this.options.minValue = newMinValue;

    this.configureDirection();

    this.setEachValue();
  }

  private configureMaxValue(newMaxValue: number) {
    const { minValue, stepSize, handlerCount, allowReversedValues } = this.options;
    const minLength = stepSize * handlerCount;

    const newMaxOutOfRange = !allowReversedValues && minValue > newMaxValue;
    const newMaxTooCloseToMin = Math.abs(newMaxValue - minValue) < minLength;
    const newMaxIsInvalid = newMaxOutOfRange || newMaxTooCloseToMin;

    if (newMaxIsInvalid) return;

    this.options.maxValue = newMaxValue;

    this.configureDirection();

    this.setEachValue();
  }

  private configureStepSize(newStepSize: number) {
    const { minValue, maxValue, handlerCount } = this.options;
    const sliderLength = Math.abs(maxValue - minValue);

    if (newStepSize > 0 && newStepSize <= sliderLength / handlerCount) {
      this.options.stepSize = newStepSize;

      this.setEachValue();
    }
  }

  private configureHandlerCount(newHandlerCount: number) {
    const { minValue, maxValue, stepSize } = this.options;
    const sliderLength = Math.abs(maxValue - minValue);
    const maxHandlerCount = Math.floor(sliderLength / stepSize);

    const isCountInRange = newHandlerCount > 0 && newHandlerCount <= maxHandlerCount;
    if (isCountInRange) {
      this.options.handlerCount = newHandlerCount;

      if (this.values.length !== newHandlerCount) this.initValues();
    }
  }

  private configureSingleOption(key: string, value: number) {
    switch (key) {
      case 'minValue':
        this.configureMinValue(value);
        break;
      case 'maxValue':
        this.configureMaxValue(value);
        break;
      case 'stepSize':
        this.configureStepSize(value);
        break;
      case 'handlerCount':
        this.configureHandlerCount(value);
        break;
      default:
    }
  }

  private configureFourOptions(o: types.ModelOptions) {
    const { minValue, maxValue, stepSize, handlerCount } = o;
    const { allowReversedValues } = this.options;

    const cannotReverse = !allowReversedValues && minValue > maxValue;
    if (cannotReverse) return;

    const tooManyZeroes = stepSize === 0 || handlerCount === 0;
    if (tooManyZeroes) return;

    const sliderLength = Math.abs(maxValue - minValue);
    const maxStepSize = sliderLength / handlerCount;

    if (stepSize > maxStepSize) return;

    this.options = {
      minValue,
      maxValue,
      stepSize,
      handlerCount,
      allowReversedValues,
    };

    this.configureDirection();

    if (this.values.length !== handlerCount) this.initValues();

    this.setEachValue();
  }

  private configure(o: types.ModelOptions) {
    const validOptions: types.ModelOptions = {};

    const { allowReversedValues } = o;
    if (typeof allowReversedValues === 'boolean') {
      this.options.allowReversedValues = allowReversedValues;
    }

    // Strip non-numeric entries, save to new object
    // Mutating existing object will break view configuration
    Object.keys(o).forEach((key) => {
      if (Model.isNumber(o[key])) {
        validOptions[key] = o[key];
      }
    });

    const keys = Object.keys(validOptions);
    const len = keys.length;
    const firstKey = keys[0];
    const firstValue = validOptions[firstKey];

    // Allow either 1 or 4 options
    switch (len) {
      case 1:
        this.configureSingleOption(firstKey, firstValue as number);
        break;
      case 4:
        this.configureFourOptions(validOptions);
        break;
      default:
        return this.options;
    }

    this.notifyObservers(this.values);

    return this.options;
  }

  private initValues() {
    const { minValue, stepSize, handlerCount } = this.options;

    this.values = [];

    for (let i = 0; i < handlerCount; i += 1) {
      this.values[i] = minValue + i * stepSize;
    }
  }

  static isNumber(n: any) {
    return !Number.isNaN(n) && Number.isFinite(n);
  }

  // Converts value to multiple of stepSize
  private normalizeValue(value: number): number {
    const { minValue, stepSize } = this.options;

    const x = value - minValue + (stepSize / 2) * this.directionMod;

    return Math.round(minValue + x - (x % stepSize));
  }

  private updateValues(updatedIndex: number, updatedValue: number) {
    const { stepSize } = this.options;

    this.values.forEach((value, index) => {
      // TODO Address case when maxValue is not a multiple of stepSize
      const minValueDiff = (index - updatedIndex) * stepSize * this.directionMod;
      const closestValue = updatedValue + minValueDiff;

      const shouldBeMovedLeft =
        index < updatedIndex &&
        value * this.directionMod > closestValue * this.directionMod;
      const shouldBeMovedRight =
        index > updatedIndex &&
        value * this.directionMod < closestValue * this.directionMod;
      const shouldBeMoved = shouldBeMovedLeft || shouldBeMovedRight;
      if (shouldBeMoved) {
        this.values[index] = closestValue;
      }
    });

    this.notifyObservers(this.values);
  }
}

export default Model;
