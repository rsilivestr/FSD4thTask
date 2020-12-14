import { Observer } from './interfaces';

export interface Model extends Observer {
  options: ModelOptions;
  values: number[];

  updateValues(index: number, value: any): number[];
}

export interface ModelOptions {
  minValue?: number;
  maxValue?: number;
  stepSize?: number;
  handlerCount?: number;
  range?: boolean;
  changed?: boolean;
}

export class RSModel implements Model {
  options: ModelOptions;
  values: number[];

  constructor() {}

  public updateValues(index: number, value: any) {
    const result = [];
    result[index] = value;
    return result;
  }

  public update() {}
}
