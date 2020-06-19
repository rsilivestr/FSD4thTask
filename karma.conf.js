module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai', 'requirejs'],
    files: [
      { pattern: './src/demo/demo.html', type: 'dom' },
      { pattern: './src/scripts/*.ts', included: 'false' },
      { pattern: './src/scripts/*.test1.ts', included: 'false' },
      // './dist/scripts/rslider.js',
      // './dist/scripts/demo.js',

      // './test/*.test.js',
      './test/test-main.js',
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
    singleRun: false,
    concurrency: Infinity,
  });
};
