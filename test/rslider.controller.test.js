/* eslint-disable no-undef */

const { controller } = sl1;
const { container } = sl1;
const handler1 = container.querySelector('.rslider__handler');

describe('RSController', () => {
  describe('grab', () => {
    const grabEvent = new MouseEvent('grabEvent');

    handler1.dispatchEvent(grabEvent);

    const grabReturn = controller.grab(grabEvent);

    it('should return something', () => {
      assert.isNotNull(grabReturn);
    });

    it('should set grabbedHandler', () => {
      const result = controller.grabbedHandler;
      assert.isNotNull(result);
    });

    it('should return handler', () => {
      const result = grabReturn.className;
      assert.equal(result, 'rslider__handler');
    });

    // it('', () => {});
  });
  describe('drag', () => {
    const dragEvent = new MouseEvent('dragEvent');

    handler1.dispatchEvent(dragEvent);

    it('should return something', () => {
      const result = controller.drag(dragEvent);
      assert.isNotNull(result);
    });

    it('should return a number', () => {
      const result = controller.drag(dragEvent);
      assert.isNumber(result);
    });

    // it('', () => {});
  });
  describe('release', () => {
    it('should unset grabbedHandler', () => {
      controller.release();
      const result = controller.grabbedHandler;
      assert.isNull(result);
    });
    // it('', () => {});
  });
});
