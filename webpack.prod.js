/* eslint-disable */
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  devtool: 'source-map',
  optimization: {
    // runtimeChunk: true,
    minimize: true,
    removeAvailableModules: true,
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
          name(module) {
            return `vendors/${module.identifier().split('/').reduceRight((item) => item).split('.')[0]}`;
          },
          chunks: 'all',
        },
      },
    },
  },
});
