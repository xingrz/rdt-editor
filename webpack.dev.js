const webpack = require('webpack');
const join = require('path').join;

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  entry: {
    main: [
      'webpack-hot-middleware/client',
      'babel-polyfill',
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
        use: [ 'react-hot-loader', 'babel-loader' ],
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
    new ExtractTextPlugin({
      filename: '[name]-[hash].css',
      allChunks: true,
    }),
    new HtmlWebpackPlugin({
      title: 'Hello World',
      template: 'index.ejs',
    }),
  ],

}
