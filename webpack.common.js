const path = require('path'),
      { CleanWebpackPlugin } = require('clean-webpack-plugin'),
      HtmlWebpackPlugin = require('html-webpack-plugin'),
      MiniCssExtractPlugin = require('mini-css-extract-plugin');
      // CopyWebpackPlugin = require('copy-webpack-plugin'),
      // webpack = require('webpack');

module.exports = {
  entry: {
    app: [ 
      './src/index.ts',
      // 'Styles/styles.sass',
    ]
  },
  output: {
    filename: 'scripts/[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  plugins: [
    new CleanWebpackPlugin(),
    // new webpack.ProvidePlugin({
    //   $: 'jquery',
    //   jQuery: 'jquery',
    //   datepicker: 'air-datepicker',
    // }),
    new HtmlWebpackPlugin({
      template: './src/index.pug'
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
      ignoreOrder: false,
    }),
    // new CopyWebpackPlugin([{
    //     from:'src/assets/images',to:'assets/images'
    // }]),
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        include: path.resolve(__dirname, 'src'),
        use: {
          // loader: 'babel-loader',
          // options: {
          //   presets: ['@babel/preset-env'],
          // },
          loader: 'ts-loader',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        include: path.resolve(__dirname, 'src/styles'),
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
      // {
      //   test: /\.css$/i,
      //   include: path.resolve(__dirname, 'src'),
      //   use: [          
      //     {
      //       loader: MiniCssExtractPlugin.loader,
      //       options: {},
      //     },
      //     {
      //       loader: 'css-loader',
      //       options: {
      //         url: false
      //       }
      //     },
      //   ],
      // },
      {
        test: /\.pug$/,
        include: path.resolve(__dirname, 'src'),
        use: [ 'pug-loader', ],
      },
      // {
      //   test: /\.(woff(2)?|ttf|eot|svg)(\?v=\d+\.\d+\.\d+)?$/,
      //   include: path.resolve(__dirname, 'src/assets/fonts/'),
      //   use: [
      //     {
      //       loader: 'file-loader',
      //       options: {
      //         name: '[path][name].[ext]',
      //         outputPath: 'assets/fonts',
      //         context: path.resolve(__dirname, './src/assets/fonts'),
      //       },
      //     },
      //   ],
      // },
      // {
      //   test: /\.(png|svg|jpg|gif)$/,
      //   include: path.resolve(__dirname, 'src/assets/images'),
      //   use: [
      //     {
      //       loader: 'file-loader',
      //     }
      //   ],
      // },
    ],
  },
  resolve: {
    alias: {
      Styles: path.resolve(__dirname, 'src/styles/'),
    }
  }
};