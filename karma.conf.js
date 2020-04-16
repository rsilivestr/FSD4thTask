module.exports = (config) => {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      {
        pattern: './dist/demo.html',
        type: 'dom',
      },
      './dist/scripts/rslider.js',
      './test/*.test.js',
    ],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    browsers: ['FirefoxHeadless'],
    autoWatch: true,
    singleRun: false,
    concurrency: Infinity,
  });
};
