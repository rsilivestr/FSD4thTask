/* eslint-disable no-undef */
import { create, addControlPanel } from './components/Slider';
import * as types from './components/types';

$.fn.extend({
  rslider(options: types.TSliderOptions) {
    return create((<JQuery>this)[0], options);
  },
});

$.fn.extend({
  rspanel(slider: types.TSlider) {
    return addControlPanel(slider);
  },
});
