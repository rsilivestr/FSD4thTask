import { Controller } from './rslider.controller';
import { Model } from './rslider.model';
import { View } from './rslider.view';
import './rslider.sass'

export class Rslider {

}

const v = new View();

const m = new Model();

const c = new Controller(v, m);

c.view.renderSquare('.foo');