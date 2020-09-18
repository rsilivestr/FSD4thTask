describe('RSPanel', () => {
  describe('public render()', () => {});

  describe('public update()', () => {
    const result = testPanel.update();

    it('Should return values array', () => {
      expect(result).to.be.an('array');
    });

    it('Should return numeric array', () => {
      result.forEach((value) => {
        expect(value).to.be.a('number');
      });
    });
  });

  // Nothing to test here
  // describe('private createInput(): HTMLInputElement', () => {});

  describe('private setHandlerValue(input: HTMLInputElement, index: number): string', () => {
    const fn = testPanel.setHandlerValue.bind(testPanel);
    const testInput = document.createElement('input');

    it('Should return a number regardless of input', () => {
      testInput.value = 0;
      expect(fn(testInput, 0)).to.be.a('number');

      testInput.value = '';
      expect(fn(testInput, 0)).to.be.a('number');

      testInput.value = 'abc';
      expect(fn(testInput, 0)).to.be.a('number');
    });

    it('Should return old value on incorrect input', () => {
      testInput.value = '10';
      expect(fn(testInput, 0)).to.equal(10);

      testInput.value = 'foo';
      expect(fn(testInput, 0)).to.equal(10);

      testInput.value = '20';
      expect(fn(testInput, 0)).to.equal(20);

      testInput.value = 'abc';
      expect(fn(testInput, 0)).to.equal(20);
    });
  });

  describe('private setModelOption(input: HTMLInputElement, key: keyof ModelOptions) ModelOptions', () => {
    const fn = testPanel.setModelOption.bind(testPanel);
    const ModelOptionsKeys = [
      'minValue',
      'maxValue',
      'stepSize',
      'handlerCount',
      'range',
      'changed',
    ];
    const testInput = document.createElement('input');

    it('Should return ModelOptions object', () => {
      expect(fn(testInput, 'minValue')).to.have.deep.keys(ModelOptionsKeys);
    });

    it('Should ignore invalid keys', () => {
      const opt = testModel.getOptions();

      fn(testInput, 'invalidKey');
      expect(testModel.getOptions()).to.equal(opt);
    });
  });
});
