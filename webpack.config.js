const webpack = require('webpack');
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = {
  watch: true,
  mode: 'development', 
  entry: './src/js/index.js', 
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
      {
        test: /\.s[ac]ss$/i,
        use: ['style-loader', 'css-loader', {
          loader: 'sass-loader',
          options: {
            implementation: require('sass'),
          },
        }],
      },
    ],
  },
  optimization: {
    minimizer: [
      new CssMinimizerPlugin(),
    ],
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'node_modules/uikit/dist/js/uikit-icons.min.js', to: 'js' }
      ],
    })
  ],
};