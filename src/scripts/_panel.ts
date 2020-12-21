import ModelOptions from './_interface/ModelOptions';
import Panel from './_interface/Panel';

export default class RSPanel implements Panel {
  container: HTMLElement;
  inputs: HTMLInputElement[] = [];
  options: ModelOptions;

  constructor(container: HTMLElement, o: ModelOptions) {
    this.container = container;
    this.options = o;
  }

  update(v: number[]): number[] {
    console.log('update');

    return v;
  }
}
