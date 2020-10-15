/* eslint-disable */

describe('RSController', () => {
  const handler = testContainer.querySelector('.rslider__handler');

  const mdown = new MouseEvent('mousedown');
  const mmove = new MouseEvent('mousemove');
  const mup = new MouseEvent('mouseup');

  const grabbed = testController.grabbedHandler;

  describe('grab', () => {
    const fn = testController.grab.bind(testController);

    it('should be a function', () => {
      expect(fn).to.be.a('function');
    });

    it('should return grabbed handler', () => {
      handler.dispatchEvent(mdown);
      expect(fn(mdown)).to.equal(handler);
    });

    it('should set grabbedHandler', () => {
      expect(testController.grabbedHandler).to.equal(handler);
    });
  });

  describe('drag', () => {
    const fn = testController.boundDrag;

    it('should be a function', () => {
      expect(fn).to.be.a('function');
    });

    it('should return a number', () => {
      expect(fn(mmove)).to.be.a('number');
    });

    it('should not change grabbedHandler', () => {
      expect(testController.grabbedHandler).to.equal(handler);
    });
  });

  describe('release', () => {
    const fn = testController.boundRelease;

    it('should be a function', () => {
      expect(fn).to.be.a('function');
    });

    it('should return nothing', () => {
      expect(fn(mup)).to.be.an('undefined');
    });

    it('should null grabbedHandler', () => {
      expect(testController.grabbedHandler).to.equal(null);
    });
  });
});
