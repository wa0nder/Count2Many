const path = require('path');

module.exports = {
  entry: './dist/App.js',
  
  output: {
    filename: 'output.js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/dist/',
    sourceMapFilename: "output.js.map"  
  },
  optimization: {
     minimize: false
  }
};