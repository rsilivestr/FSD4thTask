/* eslint-disable */
const merge = require('webpack-merge');
const TerserJSPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  optimization: {
    runtimeChunk: true,
    minimize: false,
    removeAvailableModules: true,
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true,
        },
      }),
      new OptimizeCSSAssetsPlugin(),
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
  mode: 'production',
  // devtool: 'source-map',
});
