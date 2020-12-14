describe('$().RSlider', () => {
  const div = document.createElement('div');
  document.body.appendChild(div);

  describe('Slider', () => {
    it('should return slider object', () => {
      expect(testSlider).to.be.an('object');
    });

    // it('should have certain properties', () => {
    //   expect(testSlider).to.have.all.keys([
    //     'container',
    //     'model',
    //     'view',
    //     'controller',
    //     'setOptions',
    //   ]);
    // });
  });

  describe('setOptions', () => {
    const fn = testSlider.setOptions.bind(testSlider);

    it('should be a function', () => {
      expect(fn).to.be.a('function');
    });

    // it('should return slider options', () => {
    //   expect(fn({})).to.be.an('object');
    //   expect(fn({})).to.have.all.keys([
    //     'minValue',
    //     'maxValue',
    //     'stepSize',
    //     'handlerCount',
    //     'range',
    //     'changed',
    //     'isHorizontal',
    //     'handlerRadius',
    //     'showTooltip',
    //   ]);
    // });

    // it('should actually change options', () => {
    //   // Change model option
    //   fn({ minValue: 10 });
    //   expect(testModel.getOptions().minValue).to.equal(10);
    //   // To be sure
    //   fn({ minValue: 20 });
    //   expect(testModel.getOptions().minValue).to.equal(20);
    //   // View option
    //   fn({ showTooltip: true });
    //   expect(testView.getOptions().showTooltip).to.equal(true);
    //   // One more time
    //   fn({ showTooltip: false });
    //   expect(testView.getOptions().showTooltip).to.equal(false);
    // });
  });
});
