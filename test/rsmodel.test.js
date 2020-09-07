describe('RSModel', () => {
  beforeEach(() => {
    testModel.setOptions(testOptions);
  });

  afterEach(() => {
    testModel.setOptions(testOptions);
  });

  describe('updateHandlers(index, value)', () => {
    const fn = testModel.updateHandlers.bind(testModel);

    it('should be a function', () => {
      assert.isFunction(fn);
    });

    it('should return an array of a single value of 0', () => {
      assert.deepEqual(fn(0, 0), [0]);
    });

    it('should return an array of a single value of 10', () => {
      assert.deepEqual(fn(0, 10), [10]);
    });

    it('should return an array of two values', () => {
      // add one more handler
      testModel.setOptions({ handlerCount: 2 });

      assert.deepEqual(fn(1, 40), [0, 40]);
    });

    it('should push handler with lesser index left', () => {
      testModel.setOptions({ handlerCount: 2 });
      fn(0, 10);

      assert.deepEqual(fn(1, 10), [0, 10]);
    });

    it('should push handler with larger index right', () => {
      testModel.setOptions({ handlerCount: 2 });

      assert.deepEqual(fn(0, 10), [10, 20]);
    });

    it('should push handler with larger index further right', () => {
      testModel.setOptions({ handlerCount: 2 });

      assert.deepEqual(fn(0, 50), [50, 60]);
    });

    it('should push handler with lesser index further left', () => {
      testModel.setOptions({ handlerCount: 2 });
      fn(0, 30);

      assert.deepEqual(fn(1, 30), [20, 30]);
    });

    it('should ignore non-numerical values', () => {
      testModel.setOptions({ handlerCount: 2 });

      fn(0, 0);
      fn(1, 50);

      assert.deepEqual(fn('1', 20), [0, 50]);
      assert.deepEqual(fn(1, true), [0, 50]);
      assert.deepEqual(fn(1, NaN), [0, 50]);
    });

    it('should return min/maxValue when value is out of range', () => {
      assert.deepEqual(fn(0, 999), [100]);
    });
  });

  describe('updateValue(index, value)', () => {
    const fn = testModel.updateValue.bind(testModel);

    it('should be a function', () => {
      assert.isFunction(fn);
    });

    it('should normalize value according to step size', () => {
      assert.equal(fn(0, 94.999), 90);
      assert.equal(fn(0, 85), 90);
    });

    it('should set handler value', () => {
      testModel.setOptions({ handlerCount: 1 });

      fn(0, 30);

      // direct model access
      assert.deepEqual(testModel.handlerValues, [30]);
    });
  });

  describe('getValues()', () => {
    const fn = testModel.getValues.bind(testModel);

    it('should be a function', () => {
      assert.isFunction(fn);
    });

    it('should return handler values array', () => {
      testModel.setOptions({ handlerCount: 4 });
      testModel.updateValue(0, 0);
      testModel.updateValue(1, 30);
      testModel.updateValue(2, 80);
      testModel.updateValue(3, 100);

      assert.deepEqual(fn(), [0, 30, 80, 100]);
    });
  });

  describe('getOptions()', () => {
    const fn = testModel.getOptions.bind(testModel);

    it('should be a function', () => {
      assert.isFunction(fn);
    });

    it('should return ModelOptions object', () => {
      const modelOptionsKeys = [
        'minValue',
        'maxValue',
        'stepSize',
        'range',
        'handlerCount',
        'changed',
      ];

      assert.hasAllKeys(fn(), modelOptionsKeys);
    });
  });

  describe('setOptions(options)', () => {
    const fn = testModel.setOptions.bind(testModel);

    it('should be a function', () => {
      assert.isFunction(fn);
    });

    it('should ignore incorrect options', () => {
      const opt = testModel.setOptions(testOptions);

      // can not compare to testOptions directly
      assert.equal(testModel.setOptions({ invalidOption: true }), opt);
    });

    it('should ignore incorrect minValue', () => {
      const opt = testModel.setOptions(testOptions);

      // can not compare to testOptions directly
      assert.equal(testModel.setOptions({ minValue: true }), opt);
      assert.equal(testModel.setOptions({ minValue: 'true' }), opt);
      assert.equal(testModel.setOptions({ minValue: NaN }), opt);
      assert.equal(testModel.setOptions({ minValue: null }), opt);
    });

    it('should ignore incorrect maxValue', () => {
      const opt = testModel.setOptions(testOptions);

      // can not compare to testOptions directly
      assert.equal(testModel.setOptions({ maxValue: true }), opt);
      assert.equal(testModel.setOptions({ maxValue: 'true' }), opt);
      assert.equal(testModel.setOptions({ maxValue: NaN }), opt);
      assert.equal(testModel.setOptions({ maxValue: null }), opt);
    });
  });
});
