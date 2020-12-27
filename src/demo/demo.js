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

const opt4 = {
  minValue: 0,
  maxValue: 100,
  stepSize: 10,
  handlerCount: 4,
  isHorizontal: false,
  showTooltip: false,
};
