const webpack = require('webpack');
const join = require('path').join;

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  mode: 'development',

  entry: {
    main: [
      'webpack-hot-middleware/client',
      '@babel/polyfill',
      'whatwg-fetch',
      'normalize.css',
      './src/client.js',
    ],
  },

  devtool: 'inline-source-map',

  output: {
    path: join(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name]-[hash].js',
  },

  resolve: {
    extensions: [ '.js', '.css', '.scss' ]
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: [ 'babel-loader' ],
      },
      {
        test: /\.(scss|css)$/,
        use: [ 'style-loader', 'css-loader', 'postcss-loader', 'sass-loader' ],
      },
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name]-[hash].css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      title: 'Hello World',
      template: 'index.ejs',
    }),
  ],

}
