module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    browsers: ['jsdom'],
    colors: true,
    concurrency: Infinity,
    coverageReporter: {
      type: 'text',
    },
    exclude: [
      'node_modules'
    ],
    files: [
      'src/**/*.ts',
      'test/**/*.test.ts',
    ],
    frameworks: ['chai-dom', 'chai', 'mocha', 'karma-typescript'],
    logLevel: config.LOG_INFO,
    port: 9876,
    preprocessors: {
      'src/**/*.ts': ['karma-typescript', 'coverage'],
      'test/**/*.ts': ['karma-typescript'],
    },
    reporters: ['progress', 'coverage'],
    // singleRun: false,

    karmaTypescriptConfig: {
      experimentalDecorators: true,
      extend: './tsconfig.json',
      include: [ './src/**/*.ts', './test/**/*.test.ts' ],
      module: 'commonjs',
    }
  });
};
