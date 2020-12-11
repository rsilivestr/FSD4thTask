/* eslint-disable */
module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      'node_modules/jquery/dist/jquery.min.js',
      './dist/js/rslider.js',
      './test/testSlider.js',
      './test/*.test.js',
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      './dist/js/rslider.js': ['coverage'],
    },
    coverageReporter: {
      type: 'text',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['jsdom'],
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
  });
};
