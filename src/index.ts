import { Slider, SliderOptions, create, addControlPanel } from './Components/RSlider';

$.fn.extend({
  rslider(options: SliderOptions) {
    return create((<JQuery>this)[0], options);
  },
});

$.fn.extend({
  rspanel(slider: Slider) {
    return addControlPanel(slider);
  },
});
