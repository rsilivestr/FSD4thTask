/* eslint-disable no-undef */
import SliderFacade from './components/Slider';
import * as types from './components/types';

$.fn.extend({
  rslider(options: types.TSliderOptions) {
    return SliderFacade((<JQuery>this)[0], options);
  },
});
