const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  watch: true,
  mode: 'development', 
  entry: './src/index.js', 
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'assets'),
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery'
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/uikit/dist/js/uikit-icons.min.js', to: 'js' }
      ],
    })
  ],
};