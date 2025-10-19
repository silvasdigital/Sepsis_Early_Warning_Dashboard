const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require('path');
const glob = require('glob');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  // disable source maps to avoid generating .css.map files
  devtool: false,

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ],
      },
    ],
  },

  plugins: [
    new MiniCssExtractPlugin({ filename: '[name].[contenthash].css' }),
  ],

  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        parallel: true,
        minimizerOptions: {
          preset: [
            'default',
            { discardComments: { removeAll: true }, mergeLonghand: true, cssDeclarationSorter: true }
          ],
        },
      }),
      '...',
    ],
  },
});
