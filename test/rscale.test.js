// describe('RScale', () => {
//   describe('RScale click event', () => {
//     it('Should change handler value in model', () => {
//       const mclick = new MouseEvent('click', { bubbles: true });
//       // Last mark has value of 100
//       const lastMark = testScale.scale.lastElementChild;
//       lastMark.dispatchEvent(mclick);
//       expect(testModel.getValues()).to.eql([100]);
//       // Second last mark has value of 90
//       const preLastMark = lastMark.previousElementSibling;
//       preLastMark.dispatchEvent(mclick);
//       expect(testModel.getValues()).to.eql([90]);
//     });
//   });
// });
