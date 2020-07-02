/* eslint-disable no-undef */

const viewInstance = testSlider.view;

const viewOptionsKeys = [
  'isHorizontal',
  'handlerRadius',
  'showTooltip',
];

describe('RSView', () => {
  // void function
  describe('setCoords', () => {
    // it('', () => {});
  });

  describe('render', () => {
    const renderRes = viewInstance.render();

    it('should return an HTMLElement', () => {
      assert.instanceOf(renderRes, HTMLElement);
    });

    it('should return a slider', () => {
      const result = renderRes.className;

      assert.equal(result, 'rslider rslider--layout_horizontal');
    });

    it('should contain a track', () => {
      const result = renderRes.querySelector('.rslider__track');

      assert.instanceOf(result, HTMLElement);
    });

    it('should contain at least one handler', () => {
      const result = renderRes.querySelector('.rslider__handler');

      assert.instanceOf(result, HTMLElement);
    });
  });

  describe('getRect', () => {
    it('should return an object', () => {
      const rektKeys = [
        'sliderLength',
        'minCoord',
        'maxCoord',
      ];

      const result = viewInstance.getRect();

      assert.hasAllDeepKeys(result, rektKeys);
    });

    it('shuold return numeric values', () => {
      const rektObj = viewInstance.getRect();
      const result = Object.values(rektObj);

      result.forEach((value) => {
        assert.isNumber(value);
      });
    });

    // it('', () => {});
  });

  // void for now
  describe('update', () => {
    // it('', () => {});
  });

  // check if necessary, delete otherwise
  describe('identifyHandler', () => {
    // it('', () => {});
  });

  describe('private addTooltip', () => {
    it('should return options object', () => {
      const handler = viewInstance.container.querySelector('.rslider__handler');
      const result = viewInstance.addTooltip(handler, 0);

      assert.hasAllDeepKeys(result, viewOptionsKeys);
    });

    // it('', () => {});
  });

  // void for now
  describe('setTooltip', () => {
    // it('', () => {});
  });

  describe('getOptions', () => {
    it('should return ViewOptions object', () => {
      const result = viewInstance.setOptions(options);

      assert.hasAllDeepKeys(result, viewOptionsKeys);
    });

    // it('', () => {});
  });

  describe('setOptions', () => {
    const options = {
      isHorizontal: true,
      handlerRadius: 12,
      showTooltip: true,
    };

    it('should return ViewOptions object', () => {
      const result = viewInstance.setOptions(options);

      assert.hasAllDeepKeys(result, viewOptionsKeys);
    });

    it('should return changed options', () => {
      const result = viewInstance.setOptions(options);

      assert.notStrictEqual(result, options);
    });

    it('should not accept inappropriate options', () => {
      const foulOptions = {
        emptyString: '',
        bigNumber: 12312,
      };

      const result = viewInstance.setOptions(foulOptions);

      assert.hasAllDeepKeys(result, viewOptionsKeys);
    });

    // it('', () => {});
  });
});
