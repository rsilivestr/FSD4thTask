/* eslint-disable no-undef */
describe('RSModel', () => {
  it('setOptions should not accept invalid options', () => {
    sl1.model.setOptions({ foo: 'bar' });

    const result = sl1.model.getOptions();

    assert.isUndefined(result.foo);
  });

  it('setOpions should convert string to number', () => {
    sl1.model.setOptions({ handlerCount: '4' });

    const result = sl1.model.getOptions();

    assert.equal(result.handlerCount, 4);
  });

  it('setOpions should reject strings which are not convertable to number', () => {
    sl1.model.setOptions({ handlerCount: 2 });
    sl1.model.setOptions({ handlerCount: 'four' });

    const result = sl1.model.getOptions();

    assert.equal(result.handlerCount, 2);
  });
});
