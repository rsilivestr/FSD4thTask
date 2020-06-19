/* eslint-disable no-undef */
const m = sl1.model;

const options = {
  minValue: 0,
  maxValue: 100,
  stepSize: 20,
  handlerCount: 2,
};

m.setOptions(options);

const { minValue, maxValue, stepSize } = m.getOptions();

describe('RSModel', () => {
  describe('coordToValue', () => {
    const fn = m.coordToValue.bind(m);

    it('should return number', () => {
      const result = fn(0);
      assert.isNumber(result);
    });

    it('should return minValue on 0 coord', () => {
      const result = fn(0);
      assert.equal(result, minValue);
    });

    it('should return minValue on negative coord', () => {
      const result = fn(-1);
      assert.equal(result, minValue);
    });

    it('should return maxValue on 100 coord', () => {
      const result = fn(100);
      assert.equal(result, maxValue);
    });

    it('should return maxValue on coord > 100', () => {
      const result = fn(101);
      assert.equal(result, maxValue);
    });
  });

  describe('valueToCoord', () => {
    const fn = m.valueToCoord.bind(m);

    it('should return number', () => {
      const result = fn(0);
      assert.isNumber(result);
    });

    it('should return 0 on minValue', () => {
      const result = fn(minValue);
      assert.equal(result, 0);
    });

    it('should return 0 on negative value', () => {
      const value = minValue - 1;
      const result = fn(value);

      assert.equal(result, 0);
    });

    it('should return 100 on maxValue', () => {
      const result = fn(maxValue);

      assert.equal(result, 100);
    });

    it('', () => {
      const value = maxValue + 1;
      const result = fn(value);

      assert.equal(result, 100);
    });
  });

  describe('updatePercentStep', () => {
    it('should return 20 with foreset options', () => {
      const result = m.updatePercentStep();
      assert.equal(result, 20);
    });
  });

  describe('normalizeHandlerCoord', () => {
    const fn = m.normalizeHandlerCoord.bind(m);

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
    const fn = m.updateHandlers.bind(m);
    it('', () => {
      const result = fn(0, 0);
      assert.isArray(result);
    });

    // it('', () => {});
  });

  describe('postUpdate', () => {
    const fn = m.postUpdate.bind(m);

    it('should return an array', () => {
      const result = fn();
      assert.isArray(result);
    });

    it('should return an array of numbers', () => {
      const result = fn();
      result.forEach((value) => assert.isNumber(value));
    });
  });

  describe('updateValue', () => {
    const fn = m.updateValue.bind(m);

    it('should return a value', () => {
      const result = fn(0, 0);
      assert.isNumber(result);
    });

    it('should return 0 on minValue', () => {
      const result = fn(0, minValue);
      assert.equal(result, 0);
    });

    it('should return 0 on value below minValue', () => {
      const result = fn(0, minValue - 999);
      assert.equal(result, 0);
    });

    it('should return 0 on values below minValue', () => {
      const result = fn(0, maxValue);
      assert.equal(result, 100);
    });

    it('should return 100 on values above maxValue', () => {
      const result = fn(0, maxValue + 999);
      assert.equal(result, 100);
    });

    it('should be divisible by stepSize', () => {
      const value = Math.round(Math.random(), 2) * 100;
      const result = fn(0, value) % stepSize;
      assert.equal(result, 0);
    });
  });

  describe('presetValues', () => {
    it('should return an array', () => {
      const result = m.presetValues();
      assert.isArray(result);
    });

    it('should return an array of numbers', () => {
      const result = m.presetValues();
      result.forEach((value) => assert.isNumber(value));
    });
  });

  describe('getOptions', () => {
    it('should return an object', () => {
      const result = m.getOptions();
      assert.isObject(result);
    });

    it('should contain proper keys', () => {
      const result = m.getOptions();
      const keys = ['minValue', 'maxValue', 'stepSize', 'handlerCount', 'range', 'changed'];

      assert.hasAllKeys(result, keys);
    });
  });

  describe('setOptions', () => {
    it('should not accept invalid options', () => {
      m.setOptions({ foo: 'bar' });

      const result = m.getOptions();
      assert.isUndefined(result.foo);

      // it('', () => {});
    });
  });
});
