/* eslint-disable */
const opt1 = { handlerCount: 2, minValue: 0 };
const sl1 = RSlider.create('#foo', opt1);
const pan1 = RSlider.addPanel(sl1);

const sl2 = RSlider.create('#bar', {});
const pan2 = RSlider.addPanel(sl2);

const sl3 = RSlider.create('#fizz', {});
const pan3 = RSlider.addPanel(sl3);

const opt4 = { 
  minValue: 0,
  maxValue: 100,
  stepSize: 10,
  handlerCount: 4,
  isHorizontal: false,
  showTooltip: false
}
const sl4 = RSlider.create('#buzz', opt4);
const pan4 = RSlider.addPanel(sl4);