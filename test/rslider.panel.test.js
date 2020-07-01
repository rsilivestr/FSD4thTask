/* eslint-disable no-undef */
describe('RSPanel', () => {
  const panelNode = document.querySelector('.rslider-panel');

  describe('createInput', () => {
    it('should return HTMLInputElement', () => {
      const result = pan1.createInput(panelNode, 'test');
      assert.typeOf(result, 'HTMLInputElement');
    });
  });

  describe('setHandlerValue', () => {
    const targetInput = panelNode.querySelector('.rslider-panel__input');
    const inputEvent = new KeyboardEvent('Enter', {
      key: 'Enter',
    });

    targetInput.dispatchEvent(inputEvent);

    it('should return something', () => {
      const result = pan1.setHandlerValue(inputEvent, 0);
      assert.isNotNull(result);
    });

    // it('', () => {});
  });

  describe('setModelOption', () => {
    const fn = pan1.setModelOption.bind(pan1);

    const targetInput = document.createElement('input');
    targetInput.value = '1000';
    const inputEvent = new KeyboardEvent('Input', {
      key: 'Enter',
    });

    targetInput.dispatchEvent(inputEvent);

    it('should return options object', () => {
      const result = fn(inputEvent, 'maxValue');
      assert.isObject(result);
    });

    it('should return new value', () => {
      const result = fn(inputEvent, 'maxValue');
      const { maxValue } = result;
      assert.strictEqual(maxValue, 1000);
    });

    // it('', () => {});
  });

  describe('render', () => {
    it('', () => {
      const result = pan1.render();
      assert.isNotNull(result);
    });

    // it('', () => {});
  });

  describe('update', () => {
    // it('', () => {});

    // it('', () => {});
  });
});
