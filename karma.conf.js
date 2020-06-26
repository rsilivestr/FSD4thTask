module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      { pattern: './dist/demo.html', type: 'dom' },
      './dist/scripts/rslider.js',
      './dist/scripts/demo.js',
      './test/*.test.js',
    ],
    reporters: ['progress', 'coverage'],
    preprocessors: {
      // source files, that you wanna generate coverage for
      // do not include tests or libraries
      // (these files will be instrumented by Istanbul)
      './dist/scripts/rslider.js': ['coverage'],
    },
    coverageReporter: {
      type: 'text',
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['FirefoxHeadless'],
    autoWatch: true,
    singleRun: true,
    concurrency: Infinity,
  });
};
