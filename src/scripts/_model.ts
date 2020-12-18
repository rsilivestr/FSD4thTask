import Model from './_interface/Model';
import ModelOptions from './_interface/ModelOptions';
import Presenter from './_interface/Presenter';

export default class RSModel implements Model {
  public options: ModelOptions = {};
  public presenter: Presenter;
  public values: number[] = [];

  constructor(o: ModelOptions, v: number[] = []) {
    this._configure(o);

    this._initValues(v);
  }

  private _isNumber(n: number) {
    if (typeof n === 'number' && !isNaN(n)) return true;

    return false;
  }

  private _configure(o: ModelOptions) {
    const { minValue, maxValue, stepSize, handlerCount } = o;

    if (
      // Number
      this._isNumber(minValue) &&
      // which is not equal to min
      minValue !== maxValue &&
      // and, if max will not change, not equal to existing max
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
      // and, if min will not change, not equal to existing min
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
      // Array is empty
      for (let i = 0; i < handlerCount; i += 1) {
        this.values[i] = minValue + i * stepSize;
      }
    } else {
      // Set values
      this.values = v;
    }
  }

  public config(o?: ModelOptions) {
    if (o) {
      return this._configure(o);
    }

    return this.options;
  }

  public setValues(v: number[]) {
    this.values = v;

    return this.values;
  }

  public getValues() {
    return this.values;
  }

  public notify() {
    this.presenter.update(this);
  }
}
