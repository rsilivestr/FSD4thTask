const sliderOneConfig = {
  minValue: 500,
  maxValue: 1000,
  stepSize: 10,
  handlerCount: 1,
  progress: true,
};

const sliderOne = $('#foo').rslider(sliderOneConfig);
const sliderOnePanel = sliderOne.rslider('addControlPanel');

const sliderTwo = $('#bar').rslider({
  minValue: 0,
  maxValue: 10,
  stepSize: 3,
  handlerCount: 2,
});
const sliderTwoPanel = sliderTwo.rslider('addControlPanel');

const sliderThree = $('#fizz').rslider({ isHorizontal: false });
const sliderThreePanel = sliderThree.rslider('addControlPanel');

const sliderFourConfig = {
  minValue: 7,
  maxValue: -65,
  stepSize: 10,
  handlerCount: 4,
  allowReversedValues: true,
  isHorizontal: false,
  showTooltip: false,
};

const sliderFour = $('#buzz').rslider(sliderFourConfig);
sliderFourPanel = sliderFour.rslider('addControlPanel');
