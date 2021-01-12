const s1o = {
  minValue: -50,
  maxValue: 50,
  stepSize: 10,
  handlerCount: 1,
  progress: true,
};

const s1 = RSlider.create('#foo', s1o);
const s1s = s1.addScale();
const s1p = RSlider.addControlPanel(s1);

const s2 = RSlider.create('#bar', { handlerCount: 2, progress: true });
const s2p = RSlider.addControlPanel(s2);

const s3 = RSlider.create('#fizz', { isHorizontal: false });
const s3s = s3.addScale();
const s3p = RSlider.addControlPanel(s3);

const s4o = {
  minValue: 0,
  maxValue: 100,
  stepSize: 10,
  handlerCount: 4,
  isHorizontal: false,
  showTooltip: false,
};

const s4 = RSlider.create('#buzz', s4o);
const s4p = RSlider.addControlPanel(s4);
