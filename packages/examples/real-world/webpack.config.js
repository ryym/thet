const path = require('path');
const webpack = require('webpack');

const ROOT = __dirname;

module.exports = {
  entry: [
    'webpack-hot-middleware/client?reload=true',
    path.join(ROOT, 'src'),
  ],

  output: {
    path: path.join(ROOT, 'dist'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: path.join(ROOT, 'src'),
      },
    ],
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ],
};
