const merge = require('webpack-merge'),
      common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    contentBase: './dist',
    index: 'demo.html',
    compress: true,
    overlay: true,
    open: true,
    port: 8088,
  },
});