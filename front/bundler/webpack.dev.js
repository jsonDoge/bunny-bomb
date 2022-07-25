const path = require('path');
const { merge } = require('webpack-merge');
const portFinderSync = require('portfinder-sync');
const commonConfiguration = require('./webpack.common');

module.exports = (env) => merge(
  commonConfiguration(env),
  {
    mode: 'development',
    devServer: {
      host: '127.0.0.1',
      port: portFinderSync.getPort(8080),
      open: true,
      https: false,
      client: {
        overlay: true,
      },
      static: {
        directory: path.join(__dirname, '../src/static'),
      },
    },
  },
);
