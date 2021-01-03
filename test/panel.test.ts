import { expect } from 'chai';

import { create, addControlPanel } from '../src/scripts/rslider';

const container = document.createElement('div');
container.id = 'root';
document.body.appendChild(container);

const slider = create('#root');
const panel = addControlPanel(slider);

describe('RSPanel', () => {
  // describe('notifyObservers(index: number, value: number) => void', () => {});
  // describe('update(v: number[]): number[]', () => {});
});
