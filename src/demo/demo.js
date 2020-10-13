/* eslint-disable */

const opt1 = { handlerCount: 2, minValue: 0 };

// const sl1 = RSlider.create('#foo', opt1);
// const pan1 = RSlider.addPanel(sl1);
const jqSlider1 = $().RSlider.create('#foo', opt1);
const jqPanel1 = $().RSlider.addPanel(jqSlider1);

// const sl2 = RSlider.create('#bar', { isHorizontal: false });
// const pan2 = RSlider.addPanel(sl2);
const jqSlider2 = $().RSlider.create('#bar', {
  isHorizontal: false,
  minValue: 50,
  maxValue: -50,
});
const jqPanel2 = $().RSlider.addPanel(jqSlider2);

// const sl3 = RSlider.create('#fizz', { stepSize: 1 });
// const sc3 = RSlider.addScale(sl3);
// const pan3 = RSlider.addPanel(sl3);
const jqSlider3 = $().RSlider.create('#fizz', { stepSize: 1 });
const jqScale3 = $().RSlider.addScale(jqSlider3);
const jqPanel3 = $().RSlider.addPanel(jqSlider3);

const opt4 = {
  minValue: 0,
  maxValue: 100,
  stepSize: 10,
  handlerCount: 4,
  isHorizontal: false,
  showTooltip: false,
};

// const sl4 = RSlider.create('#buzz', opt4);
// const pan4 = RSlider.addPanel(sl4);
const jqSlider4 = $().RSlider.create('#buzz', opt4);
const jqPanel4 = $().RSlider.addPanel(jqSlider4);
