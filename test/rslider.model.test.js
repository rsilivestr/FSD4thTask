/* eslint-disable no-undef */
describe('RSModel', () => {
  describe('coordToValue', () => {
    it('should return number', () => {
      const result = sl1.model.coordToValue(0);
      assert.isNumber(result);
    });

    it('should return minValue on 0 coord', () => {
      const { minValue } = sl1.model.getOptions();
      const result = sl1.model.coordToValue(0);
      assert.equal(result, minValue);
    });

    it('should return minValue on negative coord', () => {
      const { minValue } = sl1.model.getOptions();
      const result = sl1.model.coordToValue(-1);
      assert.equal(result, minValue);
    });

    it('should return maxValue on 100 coord', () => {
      const { maxValue } = sl1.model.getOptions();
      const result = sl1.model.coordToValue(100);
      assert.equal(result, maxValue);
    });

    it('should return maxValue on coord > 100', () => {
      const { maxValue } = sl1.model.getOptions();
      const result = sl1.model.coordToValue(101);
      assert.equal(result, maxValue);
    });
  });

  describe('valueToCoord', () => {
    it('should return number', () => {
      const result = sl1.model.valueToCoord(0);
      assert.isNumber(result);
    });

    it('should return 0 on minValue', () => {
      const { minValue } = sl1.model.getOptions();
      const result = sl1.model.valueToCoord(minValue);
      assert.equal(result, 0);
    });

    it('should return 0 on negative value', () => {
      const { minValue } = sl1.model.getOptions();
      const value = minValue - 1;
      const result = sl1.model.valueToCoord(value);

      assert.equal(result, 0);
    });

    it('should return 100 on maxValue', () => {
      const { maxValue } = sl1.model.getOptions();
      const result = sl1.model.valueToCoord(maxValue);

      assert.equal(result, 100);
    });


    it('', () => {
      const { maxValue } = sl1.model.getOptions();
      const value = maxValue + 1;
      const result = sl1.model.valueToCoord(value);

      assert.equal(result, 100);
    });
  });

  describe('updatePercentStep', () => {
    const options = {
      minValue: 0,
      maxValue: 100,
      stepSize: 20,
    };

    sl1.model.setOptions(options);

    const result = sl1.model.updatePercentStep();

    it('should return number', () => {
      assert.isNumber(result);
    });

    it('should return 20 with foreset options', () => {
      assert.equal(result, 20);
    });
  });

  describe('normalizeHandlerCoord', () => {
    const fn = sl1.model.normalizeHandlerCoord.bind(sl1.model);
    const { minValue, maxValue, stepSize } = sl1.model.getOptions();


    it('should throw error on bad params', () => {
      assert.throws(() => {
        fn('abc', 'def');
      }, Error);
    });

    it('should return number', () => {
      const result = fn(0, 0);
      assert.isNumber(result);
    });

    it('should return minValue for 0 index on 0 coord', () => {
      const result = fn(0, 0);

      assert.equal(result, minValue);
    });

    it('should return minValue + stepSize for 1 index on 0 coord', () => {
      const value = minValue + stepSize;
      const result = fn(1, 0);

      assert.equal(result, value);
    });

    it('should return maxValue on index 1 (last) on 100 coord', () => {
      const result = fn(1, 100);
      assert.equal(result, maxValue);
    });

    it('should return maxValue - stepSize on 0 index on 100 coord', () => {
      const value = maxValue - stepSize;
      const result = fn(0, 100);
      assert.equal(result, value);
    });
  });

  describe('updateHandlers', () => {
    const fn = sl1.model.updateHandlers.bind(sl1.model);
    it('', () => {
      const result = fn(0, 0);
      assert.isArray(result);
    });

    // it('', () => {});
  });

  describe('postUpdate', () => {});
  describe('updateValue', () => {});
  describe('presetValues', () => {});
  describe('getOptions', () => {});

  describe('setOptions', () => {
    it('should not accept invalid options', () => {
      sl1.model.setOptions({ foo: 'bar' });

      const result = sl1.model.getOptions();
      assert.isUndefined(result.foo);
    });

    // it('setOpions should convert string to number', () => {
    //   sl1.model.setOptions({ handlerCount: 2 });
    //   sl1.model.setOptions({ handlerCount: '4' });

    //   const result = sl1.model.getOptions();
    //   assert.equal(result.handlerCount, 4);
    // });

    // it('setOpions should reject strings which are not convertable to number', () => {
    //   sl1.model.setOptions({ handlerCount: 2 });
    //   sl1.model.setOptions({ handlerCount: 'four' });

    //   const result = sl1.model.getOptions();
    //   assert.equal(result.handlerCount, 2);
    // });
  });
});
