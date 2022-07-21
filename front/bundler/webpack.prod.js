const path = require('path');
const { merge } = require('webpack-merge');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const commonConfiguration = require('./webpack.common');

module.exports = merge(
  commonConfiguration,
  {
    mode: 'production',
    plugins:
        [
          new CopyPlugin({
            patterns: [
              { from: path.join(__dirname, '../src/static/models'), to: 'models' },
            ],
          }),
          new CleanWebpackPlugin(),
        ],
  },
);
