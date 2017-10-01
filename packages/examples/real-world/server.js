const path = require('path');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const express = require('express');
const config = require('./webpack.config');

const port = 8080;
const app = express();
const compiler = webpack(config);
const indexPath = path.join(__dirname, '..', 'index.html');

app.use(webpackDevMiddleware(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath,
}));
app.use(webpackHotMiddleware(compiler));

app.get('/favicon.ico', (req, res) => res.status(404));

['/', '/:login', '/:login/:name'].forEach(appPath => {
  app.get(appPath, (req, res) => {
    res.sendFile(indexPath);
  });
});

app.listen(port, (error) => {
  if (error) {
    console.error(error);
  }

  console.info(
    `==> Listening on port ${port}.`,
    `Open up http://localhost:${port}/ in your browser.`,
  );
});
