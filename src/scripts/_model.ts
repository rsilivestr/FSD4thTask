import Model from './_interface/Model';
import ModelOptions from './_interface/ModelOptions';
import RSubject from './_subject';

export default class RSModel extends RSubject implements Model {
  public options: ModelOptions = {};
  public values: number[] = [];
  private stepSizePerc: number;

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

  public getValues() {
    // Get values array
    return this.values;
  }

  public getValue(id: number) {
    return this.values[id] || null;
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

  private _initValues() {
    const { minValue, stepSize, handlerCount } = this.options;
    // Fill each step starting from minValue
    for (let i = 0; i < handlerCount; i += 1) {
      this.values[i] = minValue + i * stepSize;
    }
  }

  private _updatePercentStep() {
    const scaleLength = this.options.maxValue - this.options.minValue;
    this.stepSizePerc = (this.options.stepSize / scaleLength) * 100;

    return this.stepSizePerc;
  }

  private _normalizeValue(value: number): number {
    const { minValue, stepSize } = this.options;
    // minValue added to work with negative values
    const x = value - minValue + stepSize / 2;
    return minValue + x - (x % stepSize);
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
