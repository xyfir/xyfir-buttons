const webpack = require('webpack');
const path = require('path');

module.exports = {
  
  entry: {
    app: './extension/app.js',
    inject: './extension/inject.js',
    background: './extension/background.js',
    contentScript: './extension/content-script.js'
  },
  
  output: {
    filename: '[name].js',
    path: './build'
  },

  resolve: {
    modules: [
      path.resolve(__dirname, './'),
      "node_modules"
    ],
    extensions: ['.js', '.jsx']
  },

  module: {
    rules: [{
      test: /\.jsx?$/,
      loader: 'babel-loader',
      include: [
        path.resolve(__dirname, 'components'),
        path.resolve(__dirname, 'constants'),
        path.resolve(__dirname, 'lib')
      ],
      exclude: /node_modules/,
      options: {
        presets: ['es2017', 'es2016', 'es2015', 'react']
      }
    }]
  },

  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      mangle: false,
      compress: { unused: false }
    })
  ]

};