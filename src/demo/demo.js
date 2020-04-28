/* eslint-disable */
const opt1 = { handlerCount: 2 };
const sl1 = RSlider.create('#foo', opt1);
const pan1 = RSlider.addPanel(sl1);

const sl2 = RSlider.create('#bar', {});
const pan2 = RSlider.addPanel(sl2);

const sl3 = RSlider.create('#fizz', {});
const pan3 = RSlider.addPanel(sl3);

const sl4 = RSlider.create('#buzz', {});
const pan4 = RSlider.addPanel(sl4);