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
          {
            loader: 'awesome-typescript-loader',
            options: {
              configFileName: path.join(ROOT, 'tsconfig.json'),
            },
          }
        ],
        include: [
          path.join(ROOT, 'src'),
        ]
      },
      {
        test: /\.css$/,
        loaders: [
          'style-loader',
          'css-loader',
        ],
        // include: [
        //   path.join(ROOT, 'node_modules', 'todovc-app-css'),
        // ]
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development'),
    }),
  ]
}
