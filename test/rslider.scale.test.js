/* eslint-disable no-undef */

const scaleInstance = sc3;
const scaleNode = scaleInstance.scale;

describe('RScale', () => {
  describe('private populateScale', () => {
    it('should return something', () => {
      const result = scaleInstance.populateScale(scaleNode);

      assert.isNotNull(result);
    });

    // it('', () => {});
  });

  describe('public render', () => {
    it('should return something', () => {
      const result = scaleInstance.render();
      assert.isNotNull(result);
    });

    it('should return scale element', () => {
      const result = scaleInstance.render().className;
      assert.equal(result, 'rslider-scale rslider-scale--layout_horizontal');
    });
  });

  describe('update', () => {
    it('', () => {
      const result = scaleInstance.update;
      assert.isFunction(result);
    });

    // it('', () => {});
  });
});
