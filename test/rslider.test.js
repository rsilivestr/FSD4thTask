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

const testSlider = RSlider.create('#test-container', testOptions);
const testScale = RSlider.addScale(testSlider);
const testPanel = RSlider.addPanel(testSlider);

describe('RSlider', () => {
  describe('create', () => {
    it('should return an Object', () => {
      assert.typeOf(testSlider, 'Object');
    });

    it('should work without options provided', () => {
      assert.typeOf(RSlider.create('#test-container'), 'Object');
    });

    it('should throw an error if there is no element matching provider selector', () => {
      assert.throws(
        RSlider.create,
        'There is no element matching provided selector...'
      );
    });

    // it('', () => {});
  });

  describe('addPanel', () => {
    it('should return an Object', () => {
      assert.typeOf(testPanel, 'Object');
    });

    // it('', () => {});
  });

  describe('addScale', () => {
    it('should return an Object', () => {
      assert.typeOf(testScale, 'Object');
    });

    it('should have properties', () => {
      const keys = ['scale'];
      // keys.forEach((key) => assert.isTrue(testScale.hasOwnProperty(key)));
      // console.log(testScale);
    });

    // it('', () => {});
  });
});
