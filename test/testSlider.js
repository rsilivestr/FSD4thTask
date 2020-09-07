const testContainer = document.createElement('div');
testContainer.id = 'test-container';
document.body.appendChild(testContainer);

const testOptions = {
  minValue: 0,
  maxValue: 100,
  stepSize: 10,
  handlerCount: 1,
  isHorizontal: true,
  showTooltip: false,
};

const testSlider = RSlider.create('#test-container', testOptions);

const testModel = testSlider.model;
const testController = testSlider.controller;
const testView = testSlider.view;
