/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const slsw = require('serverless-webpack');
const path = require('path');
module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  externals: ['./opt/nodejs/node_modules/sharp'],
  node: {
    __dirname: false,
  },
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'watermark.svg'),
          to: path.resolve(__dirname, '.webpack/afterImageUpload'),
        },
      ],
    }),
  ],
  module: {
    rules: [{ test: /\.js$/, exclude: /\/opt\/nodejs\/node_modules\// }],
  },
};
