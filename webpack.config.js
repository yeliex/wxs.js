/**
 * Creator: yeliex
 * Project: wxs.js
 * Description:
 */

const webpack = require('webpack');

module.exports = {
  entry: './src/index.js',
  output: {
    path: require('path').join(__dirname, '/dist'),
    libraryTarget: "umd",
    filename: "index.js"
  },
  module: {
    loaders: [
      {
        test: /\.js?$/,
        exclude: /node_modules/,
        loader: "babel"
      }
    ]
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   "process.env": {
    //     NODE_ENV: JSON.stringify("production")
    //   }
    // }),
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     warnings: false
    //   }
    // })
  ]
};
