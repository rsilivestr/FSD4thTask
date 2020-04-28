/* eslint-disable no-undef */
describe('RSPanel', () => {
  const panel = document.querySelector('.rslider-panel');
  describe('createInput', () => {
    it('should return HTMLInputElement', () => {
      const result = pan1.createInput(panel, 'test');
      assert.typeOf(result, 'HTMLInputElement');
    });
  });

  describe('setHandlerValue', () => {
    it('', () => {
      // const result = pan1.setHandlerValue()
    });
  });

  describe('setModelOption', () => {
    // it('', () => {});
  });

  describe('render', () => {
    // it('', () => {});
  });

  describe('update', () => {
    // it('', () => {});
  });
});
