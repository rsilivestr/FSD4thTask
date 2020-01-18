const merge = require('webpack-merge'),
      common = require('./webpack.common.js'),
      TerserJSPlugin = require('terser-webpack-plugin'),
      OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(common, {  
  optimization: {
    minimizer: [
      new TerserJSPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
      }), 
      new OptimizeCSSAssetsPlugin(),
    ],
    splitChunks: {
      cacheGroups: {
        commons: {
          enforce: true,
          test: /[\\/]node_modules[\\/]/,
            name(module) {
              return `vendors/${module.identifier().split('/').reduceRight(item => item).split('.')[0]}`;
            },
          chunks: 'all',
        },
      },
    },
  },
  mode: 'production',
  // devtool: 'source-map',
});