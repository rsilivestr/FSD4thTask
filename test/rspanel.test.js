// describe('RSPanel', () => {
//   describe('public render()', () => {});

//   // Void
//   describe('public update()', () => {});

//   // Nothing to test here
//   // describe('private createInput(): HTMLInputElement', () => {});

//   describe('private _setHandlerValue(input: HTMLInputElement, index: number): string', () => {
//     const fn = testPanel._setHandlerValue.bind(testPanel);
//     const testInput = document.createElement('input');

//     it('Should return a number regardless of input', () => {
//       testInput.value = 0;
//       expect(fn(testInput, 0)).to.be.a('number');

//       testInput.value = '';
//       expect(fn(testInput, 0)).to.be.a('number');

//       testInput.value = 'abc';
//       expect(fn(testInput, 0)).to.be.a('number');
//     });

//     it('Should return old value on incorrect input', () => {
//       testInput.value = '10';
//       expect(fn(testInput, 0)).to.equal(10);

//       testInput.value = 'foo';
//       expect(fn(testInput, 0)).to.equal(10);

//       testInput.value = '20';
//       expect(fn(testInput, 0)).to.equal(20);

//       testInput.value = 'abc';
//       expect(fn(testInput, 0)).to.equal(20);
//     });
//   });

//   describe('private _setModelOption(input: HTMLInputElement, key: keyof ModelOptions) ModelOptions', () => {
//     const fn = testPanel._setModelOption.bind(testPanel);
//     const ModelOptionsKeys = [
//       'minValue',
//       'maxValue',
//       'stepSize',
//       'handlerCount',
//       'range',
//       'changed',
//     ];
//     const testInput = document.createElement('input');

//     it('Should return ModelOptions object', () => {
//       expect(fn(testInput, 'minValue')).to.have.deep.keys(ModelOptionsKeys);
//     });

//     it('Should return ModelOptions object', () => {
//       // testInput.value = '10';
//       expect(fn(testInput, 'stepSize')).to.have.deep.keys(ModelOptionsKeys);
//     });

//     it('Should ignore invalid keys', () => {
//       const opt = testModel.getOptions();

//       fn(testInput, 'invalidKey');
//       expect(testModel.getOptions()).to.equal(opt);
//     });
//   });
// });
