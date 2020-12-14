// const viewOptionsKeys = ['isHorizontal', 'handlerRadius', 'showTooltip'];

// describe('RSView', () => {
//   // can be run only once for now
//   describe('render(): HTMLElement', () => {});

//   describe('getRect(): Rect', () => {
//     const rect = testView.getRect();
//     const rectKeys = ['sliderLength', 'minCoord', 'maxCoord'];

//     it('Should return an object', () => {
//       expect(rect).to.be.an('object');
//     });

//     it('Result should contain certain keys', () => {
//       expect(rect).to.have.deep.keys(rectKeys);
//     });

//     it('Result should contain numeric values', () => {
//       rectKeys.forEach((key) => {
//         expect(rect[key]).to.be.a('number');
//       });
//     });
//   });

//   describe('update(values: number[]): void', () => {});

//   describe('setTooltip(value: boolean): void', () => {});

//   describe('getOptions(): ViewOptions', () => {
//     it('should return ViewOptions object', () => {
//       const res = testView.getOptions();

//       expect(res).to.have.deep.keys(viewOptionsKeys);

//       expect(res.isHorizontal).to.be.a('boolean');
//       expect(res.handlerRadius).to.be.a('number');
//       expect(res.showTooltip).to.be.a('boolean');
//     });
//   });

//   describe('setOptions(options: ViewOptions): ViewOptions', () => {
//     const fn = testView.setOptions.bind(testView);

//     it('should return ViewOptions object', () => {
//       const res = fn();

//       expect(res).to.have.deep.keys(viewOptionsKeys);

//       expect(res.isHorizontal).to.be.a('boolean');
//       expect(res.handlerRadius).to.be.a('number');
//       expect(res.showTooltip).to.be.a('boolean');
//     });

//     it('should set isHorizontal: boolean option', () => {
//       expect(fn({ isHorizontal: true }).isHorizontal).to.equal(true);
//       expect(fn({ isHorizontal: false }).isHorizontal).to.equal(false);
//     });

//     it('should set handlerRadius: number option', () => {
//       for (let i = 0; i < 6; i += 1) {
//         const radius = Math.ceil(Math.random() * 20);

//         const res = fn({ handlerRadius: radius }).handlerRadius;

//         expect(res).to.equal(radius);
//       }
//     });

//     it('should set showTooltip: boolean option', () => {
//       expect(fn({ showTooltip: true }).showTooltip).to.equal(true);
//       expect(fn({ showTooltip: false }).showTooltip).to.equal(false);
//     });

//     it('should ignore invalid (non-boolean) isHorizontal value', () => {
//       fn({ isHorizontal: true });

//       expect(fn({ showTooltip: 'false' }).isHorizontal).to.equal(true);
//       expect(fn({ showTooltip: 0 }).isHorizontal).to.equal(true);
//       expect(fn({ showTooltip: NaN }).isHorizontal).to.equal(true);
//       expect(fn({ showTooltip: null }).isHorizontal).to.equal(true);
//       expect(fn({ showTooltip: '' }).isHorizontal).to.equal(true);
//     });

//     it('should ignore invalid (non-numeric) handlerRadius values', () => {
//       fn({ handlerRadius: 21 });

//       expect(fn({ handlerRadius: '22' }).handlerRadius).to.equal(21);
//       expect(fn({ handlerRadius: '' }).handlerRadius).to.equal(21);
//       expect(fn({ handlerRadius: true }).handlerRadius).to.equal(21);
//       expect(fn({ handlerRadius: NaN }).handlerRadius).to.equal(21);
//       expect(fn({ handlerRadius: null }).handlerRadius).to.equal(21);
//     });

//     it('should ignore invalid (non-boolean) showTooltip values', () => {
//       fn({ showTooltip: true });

//       expect(fn({ showTooltip: 'false' }).showTooltip).to.equal(true);
//       expect(fn({ showTooltip: 0 }).showTooltip).to.equal(true);
//       expect(fn({ showTooltip: NaN }).showTooltip).to.equal(true);
//       expect(fn({ showTooltip: null }).showTooltip).to.equal(true);
//       expect(fn({ showTooltip: [false] }).showTooltip).to.equal(true);
//       expect(fn({ showTooltip: { value: false } }).showTooltip).to.equal(true);
//     });
//   });

//   describe('getContainer()', () => {
//     it('should return container element', () => {
//       expect(testView.getContainer()).to.equal(testContainer);
//     });
//   });
// });
