import Subject from './Subject';
import { TModel, TModelOptions, TModelOptionsPartial } from './types';

class Model extends Subject implements TModel {
  private directionMod: 1 | -1 = 1;

  private options: TModelOptions = {
    minValue: 0,
    maxValue: 100,
    stepSize: 10,
    handlerCount: 1,
    allowReversedValues: false,
    handlerInteraction: 'block',
  };

  private values: number[] = [];

  constructor(o: TModelOptionsPartial = {}) {
    super();

    this.initValues();
    this.setConfig(o);
  }

  public getConfig() {
    return this.options;
  }

  public setConfig(o: TModelOptionsPartial) {
    if (typeof o.allowReversedValues === 'boolean') {
      this.options.allowReversedValues = o.allowReversedValues;
    }

    const isHandlerInteractionValid =
      o.handlerInteraction !== undefined &&
      ['block', 'move', 'pass'].includes(o.handlerInteraction);
    if (isHandlerInteractionValid) {
      this.options.handlerInteraction = <'block' | 'move' | 'pass'>o.handlerInteraction;
    }

    const numericOptionCount = Model.countNumericOptions(o);

    if (numericOptionCount === 1) {
      Object.entries(o).forEach(([key, value]) => {
        if (Model.isNumber(value)) {
          this.configureSingleOption(key, <number>value);
        }
      });
    } else if (numericOptionCount > 1) {
      this.configureFourOptions({ ...this.options, ...o });
    }

    this.notifyObservers(this.values);
  }

  public getValue(index: number) {
    return this.values[index];
  }

  public getValues() {
    return this.values;
  }

  public setValue(index: number, value: number) {
    const { minValue, maxValue, stepSize, handlerCount } = this.options;

    const pass = this.options.handlerInteraction === 'pass';

    const min = pass ? minValue : minValue + index * stepSize * this.directionMod;
    const maxDiff = stepSize - Math.abs((maxValue - minValue) % stepSize);
    const pseudoMaxValue =
      maxDiff === stepSize ? maxValue : maxValue + maxDiff * this.directionMod;
    let max = pseudoMaxValue - (handlerCount - index - 1) * stepSize * this.directionMod;
    if (max * this.directionMod > maxValue * this.directionMod) max = maxValue;
    if (pass) max = maxValue;

    const valueIsBelowMin = value * this.directionMod < min * this.directionMod;
    const closeToMax =
      max * this.directionMod - ((stepSize - maxDiff) / 2) * this.directionMod;
    const valueIsCloseToOrAboveMax = value * this.directionMod >= closeToMax;

    let val = 0;
    if (valueIsBelowMin) {
      val = min;
    } else if (valueIsCloseToOrAboveMax) {
      val = max;
    } else {
      val = this.normalizeValue(value);
    }

    this.values[index] = val;

    this.updateValues(index, val);
  }

  public setValues(v: number[]) {
    this.values = v;

    this.setEachValue();
  }

  private setEachValue() {
    if (!this.values) return;

    this.values.forEach((value, index) => this.setValue(index, value));
  }

  private configureDirection() {
    const maxIsGreaterThanMin = this.options.maxValue > this.options.minValue;
    const oldMod = this.directionMod;
    this.directionMod = maxIsGreaterThanMin ? 1 : -1;

    if (oldMod !== this.directionMod) this.initValues();
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

  static countNumericOptions(o: TModelOptionsPartial): number {
    let count = 0;

    Object.values(o).forEach((value) => {
      if (Model.isNumber(value)) {
        count += 1;
      }
    });

    return count;
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

  private configureFourOptions(o: TModelOptions) {
    const {
      minValue,
      maxValue,
      stepSize,
      handlerCount,
      allowReversedValues,
      handlerInteraction,
    } = o;

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
      handlerInteraction,
    };

    this.configureDirection();
    const hasHandlerCountChanged = this.values.length !== handlerCount;

    if (hasHandlerCountChanged) this.initValues();

    this.setEachValue();
  }

  private initValues() {
    const { minValue, stepSize, handlerCount } = this.options;

    this.values = [];

    for (let i = 0; i < handlerCount; i += 1) {
      this.values[i] = minValue + i * stepSize * this.directionMod;
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
    const { stepSize, minValue, maxValue, handlerInteraction } = this.options;

    switch (handlerInteraction) {
      case 'block': {
        const leftNeighbour = this.values[updatedIndex - 1];
        if (
          leftNeighbour &&
          updatedValue * this.directionMod <= leftNeighbour * this.directionMod
        ) {
          const closestStep = leftNeighbour + stepSize * this.directionMod;
          this.values[updatedIndex] =
            closestStep * this.directionMod < maxValue * this.directionMod
              ? closestStep
              : maxValue;
        }
        const rightNeighbour = this.values[updatedIndex + 1];
        if (
          rightNeighbour &&
          updatedValue * this.directionMod >= rightNeighbour * this.directionMod
        ) {
          this.values[updatedIndex] = rightNeighbour - stepSize * this.directionMod;
        }

        break;
      }
      case 'move': {
        this.values.forEach((value, index) => {
          const minValueDiff = (index - updatedIndex) * stepSize;
          const closestStep = updatedValue + minValueDiff * this.directionMod;

          let closestValue: number;
          if (closestStep * this.directionMod > maxValue * this.directionMod) {
            closestValue = maxValue;
          } else if ((closestStep - minValue) % stepSize !== 0) {
            closestValue = value;
          } else {
            closestValue = closestStep;
          }

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
        break;
      }
      case 'pass':
      default:
    }

    this.notifyObservers(this.values);
  }
}

export default Model;
