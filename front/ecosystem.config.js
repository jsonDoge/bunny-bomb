module.exports = {
  apps: [{
    name: 'bunny',
    script: 'serve',
    env: {
      PM2_SERVE_PORT: 6666,
      PM2_SERVE_SPA: 'true',
      PM2_SERVE_PATH: './dist',
      PM2_SERVE_HOMEPAGE: './index.html'
    }
  }],
};
