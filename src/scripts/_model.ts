import Model from './_interface/Model';
import ModelOptions from './_interface/ModelOptions';
import Subject from './_subject';

export default class RSModel extends Subject implements Model {
  public container: HTMLElement;
  public options: ModelOptions;
  public stepSizePerc: number;
  public values: number[] = [];

  constructor(container: HTMLElement, options: ModelOptions) {
    super();

    this.container = container;
    this.options = options;
  }

  public getValues(): number[] {
    return this.values;
  }

  public getOptions(): ModelOptions {
    return this.options;
  }

  public setOptions(o: ModelOptions): ModelOptions {
    this.options = o;
    return this.options;
  }

  public update() {}
}
