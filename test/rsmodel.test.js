/* eslint-disable */

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
      expect(fn).to.be.a('function');
    });

    it('should return an array of a single value of 0', () => {
      expect(fn(0, 0)).to.eql([0]);
    });

    it('should return an array of a single value of 10', () => {
      expect(fn(0, 10)).to.eql([10]);
    });

    it('should return an array of two values', () => {
      // add one more handler
      testModel.setOptions({ handlerCount: 2 });

      expect(fn(1, 40)).to.eql([0, 40]);
    });

    it('should push handler with lesser index left', () => {
      testModel.setOptions({ handlerCount: 2 });
      fn(0, 10);

      expect(fn(1, 10)).to.eql([0, 10]);
    });

    it('should push handler with larger index right', () => {
      testModel.setOptions({ handlerCount: 2 });

      expect(fn(0, 10)).to.eql([10, 20]);
    });

    it('should push handler with larger index further right', () => {
      testModel.setOptions({ handlerCount: 2 });

      expect(fn(0, 50)).to.eql([50, 60]);
    });

    it('should push handler with lesser index further left', () => {
      testModel.setOptions({ handlerCount: 2 });
      fn(0, 30);

      expect(fn(1, 30)).to.eql([20, 30]);
    });

    it('should ignore non-numerical values', () => {
      testModel.setOptions({ handlerCount: 2 });

      fn(0, 0);
      fn(1, 50);

      expect(fn('1', 20)).to.eql([0, 50]);
      expect(fn(1, true)).to.eql([0, 50]);
      expect(fn(1, NaN)).to.eql([0, 50]);
    });

    it('should return min/maxValue when value is out of range', () => {
      expect(fn(0, 999)).to.eql([100]);
    });
  });

  describe('updateValue(index, value)', () => {
    const fn = testModel.updateValue.bind(testModel);

    it('should be a function', () => {
      expect(fn).to.be.a('function');
    });

    it('should normalize value according to step size', () => {
      expect(fn(0, 94.999)).to.equal(90);
      expect(fn(0, 85)).to.equal(90);
    });

    it('should set handler value', () => {
      testModel.setOptions({ handlerCount: 1 });

      fn(0, 30);

      // direct model access
      expect(testModel.handlerValues).to.eql([30]);
    });
  });

  describe('getValues()', () => {
    const fn = testModel.getValues.bind(testModel);

    it('should be a function', () => {
      expect(fn).to.be.a('function');
    });

    it('should return handler values array', () => {
      testModel.setOptions({ handlerCount: 4 });
      testModel.updateValue(0, 0);
      testModel.updateValue(1, 30);
      testModel.updateValue(2, 80);
      testModel.updateValue(3, 100);

      expect(fn()).to.eql([0, 30, 80, 100]);
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
      const min = testModel.setOptions(testOptions).minValue;

      expect(testModel.setOptions({ minValue: true }).minValue).to.equal(min);
      expect(testModel.setOptions({ minValue: 'true' }).minValue).to.equal(min);
      expect(testModel.setOptions({ minValue: NaN }).minValue).to.equal(min);
      expect(testModel.setOptions({ minValue: null }).minValue).to.equal(min);
    });

    it('should ignore incorrect maxValue', () => {
      const max = testModel.setOptions(testOptions).maxValue;

      expect(testModel.setOptions({ minValue: true }).maxValue).to.equal(max);
      expect(testModel.setOptions({ minValue: 'true' }).maxValue).to.equal(max);
      expect(testModel.setOptions({ minValue: NaN }).maxValue).to.equal(max);
      expect(testModel.setOptions({ minValue: null }).maxValue).to.equal(max);
    });

    it('should do something when minValue > maxValue', () => {
      const opt = testModel.setOptions({ minValue: 100, maxValue: 0 });

      console.log(opt);
    });
  });
});
