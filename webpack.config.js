const webpack = require('webpack');
const path = require('path');

module.exports = {
  mode: 'development',

  entry: {
    app: './main/app.js',
    inject: './main/inject.js',
    background: './main/background.js',
    'content-script': './main/content-script.js'
  },

  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'build')
  },

  resolve: {
    modules: [path.resolve(__dirname, './'), 'node_modules'],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'components'),
          path.resolve(__dirname, 'constants'),
          path.resolve(__dirname, 'main'),
          path.resolve(__dirname, 'lib')
        ],
        exclude: /node_modules/,
        options: {
          presets: [
            [
              'env',
              {
                targets: {
                  browsers: ['last 1 Chrome versions']
                }
              }
            ],
            'react'
          ]
        }
      }
    ]
  }
};
