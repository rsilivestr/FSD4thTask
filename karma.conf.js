module.exports = (config) => {
  config.set({
    autoWatch: true,
    basePath: '',
    browsers: ['jsdom'],
    browserNoActivityTimeout: 999999,
    colors: true,
    concurrency: Infinity,
    coverageReporter: {
      type: 'text',
    },
    exclude: ['node_modules'],
    files: ['node_modules/jquery/dist/jquery.min.js', 'src/**/*.ts', 'test/**/*.test.ts'],
    frameworks: ['chai-dom', 'chai', 'mocha', 'karma-typescript'],
    logLevel: config.LOG_INFO,
    port: 9876,
    preprocessors: {
      'src/**/*.ts': ['karma-typescript', 'coverage'],
      'test/**/*.ts': ['karma-typescript'],
    },
    reporters: ['progress', 'coverage'],
    karmaTypescriptConfig: {
      compilerOptions: {
        esModuleInterop: true,
        baseUrl: '.',
        paths: { '@/*': ['src/*'] },
      },
      include: ['./src/**/*.ts', './test/**/*.test.ts'],
    },
  });
};
