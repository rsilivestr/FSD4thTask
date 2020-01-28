import { Controller } from './rslider.controller';
import { Model } from './rslider.model';
import { View } from './rslider.view';

export class Rslider {
  container: object | null;

  constructor(selector: string = '.rslider') {
    this.container = document.querySelector(selector);
  }
}

let a = new View();
a.clg('abc');