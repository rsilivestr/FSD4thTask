const s1o = {
  minValue: 500,
  maxValue: 1000,
  stepSize: 10,
  handlerCount: 1,
  progress: true,
};

const s1 = $('#foo').rslider(s1o);
const s1p = $().rspanel(s1);

const s2 = $('#bar').rslider({ minValue: 0, maxValue: 10, stepSize: 3, handlerCount: 2 });
const s2p = $().rspanel(s2);

const s3 = $('#fizz').rslider({ isHorizontal: false });
const s3p = $().rspanel(s3);

const s4o = {
  minValue: 9,
  maxValue: -65,
  stepSize: 10,
  handlerCount: 4,
  allowReversedValues: true,
  isHorizontal: false,
  showTooltip: false,
};

const s4 = $('#buzz').rslider(s4o);
const s4p = $().rspanel(s4);
