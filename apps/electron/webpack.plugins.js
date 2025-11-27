const HtmlWebpackPlugin = require('html-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');

module.exports = [
  new HtmlWebpackPlugin({
    template: './src/renderer/index.html',
  }),
  new VueLoaderPlugin(),
];

