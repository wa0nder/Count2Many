const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './dist/App.js',
  
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    sourceMapFilename: "output.js.map"  
  },
  watch:true,
  optimization: {
     minimize: false
  }
};