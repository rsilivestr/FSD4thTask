/* eslint-disable no-undef */

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

// eslint-disable-next-line no-unused-vars
const testSlider = RSlider.create('#test-container', testOptions);

describe('RSlider', () => {
  it('RSlider.create() should be accessible and be of type function', () => {
    const result = RSlider.create;
    assert.isFunction(result);
  });

  // it('', () => {});

  // it('', () => {});
});
