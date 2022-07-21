const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = {
  entry: path.resolve(__dirname, '../src/script.js'),
  output: {
    filename: 'bundle.[contenthash].js',
    path: path.resolve(__dirname, '../dist'),
  },
  devtool: 'source-map',
  plugins: [
    new Dotenv(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      favicon: './src/static/favicon-32x32.png',
      minify: false,
    }),
  ],
  module: {
    rules: [
      // HTML
      {
        test: /\.(html)$/,
        use: ['html-loader'],
      },

      // JS
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
          },
        },
      },

      // CSS
      {
        test: /\.css$/,
        include: path.resolve(__dirname, '../src'),
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
        ],
      },

      // Images
      {
        test: /\.(jpg|png|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/images/',
            },
          },
        ],
      },

      // Fonts
      {
        test: /\.(ttf|eot|woff|woff2)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              outputPath: 'assets/fonts/',
            },
          },
        ],
      },
    ],
  },
};
