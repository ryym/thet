const path = require('path')
const webpack = require('webpack')

const ROOT = __dirname

module.exports = {
  entry: path.join(ROOT, 'src'),

  output: {
    path: path.join(ROOT, 'dist'),
    filename: 'bundle.js',
    publicPath: '/assets/',
  },

  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },

  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loaders: [
          'babel-loader',
          'awesome-typescript-loader'
        ],
        include: [
          path.join(ROOT, 'src'),
          path.join(ROOT, '..', '..', 'src'),
        ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ]
}
