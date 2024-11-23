// Do this as the first thing so that any code reading it knows the right env.
process.env.BABEL_ENV = 'production';
process.env.NODE_ENV = 'production';
process.env.ASSET_PATH = '/';

const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const ZipPlugin = require('zip-webpack-plugin');
const config = require('../webpack.config');

delete config.chromeExtensionBoilerplate;

config.mode = 'production';

const packageInfo = JSON.parse(fs.readFileSync('package.json', 'utf-8'));

const filename = `${packageInfo.name}-${packageInfo.version}.zip`;
const zipPath = path.join(__dirname, '../', 'zip');

config.plugins = (config.plugins || []).concat(
  new ZipPlugin({ filename, path: zipPath })
);

webpack(config, (err, stats) => {
  console.log('stats: ', stats);
  console.log(`zip file ${filename} is on `, zipPath);

  if (err) {
    throw err;
  }
});
