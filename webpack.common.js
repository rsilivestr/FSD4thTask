const path = require('path'),
      { CleanWebpackPlugin } = require('clean-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: {
    demo: './src/demo.ts',
    rslider: './src/rslider.ts',
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: './src/demo.pug',
      filename: 'demo.html'
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      ignoreOrder: false,
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          loader: 'ts-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, 'src'),
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {},
          },
          {
            loader: 'css-loader',
            options: {
              url: false
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              ident: 'postcss',
              plugins: [
                require('autoprefixer'),
              ]
            }
          },
          'sass-loader',
        ],
      },
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, 'src'),
        use: [ 'pug-loader', ],
      },
    ],
  },
  resolve: {
    extensions: [".js", ".ts"],
  }
};