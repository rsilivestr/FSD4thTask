const s1o = {
  minValue: -50,
  maxValue: 50,
  stepSize: 10,
  handlerCount: 1,
  progress: true,
};

const s1 = RSlider.create('#foo', s1o);
const s1p = s1.addPanel();
const s1s = s1.addScale();

const s2 = RSlider.create('#bar', { handlerCount: 2 });
const s2p = s2.addPanel();

const s3 = RSlider.create('#fizz', { isHorizontal: false });

const s4o = {
  minValue: 0,
  maxValue: 100,
  stepSize: 10,
  handlerCount: 4,
  isHorizontal: false,
  showTooltip: false,
};

const s4 = RSlider.create('#buzz', s4o);
