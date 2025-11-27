const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
  test: /\.css$/,
  use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

// TypeScript规则已在webpack.rules.js中定义，这里不需要重复

rules.push({
  test: /\.vue$/,
  use: [{ loader: 'vue-loader' }],
});

module.exports = {
  module: {
    rules,
  },
  plugins: plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json', '.vue'],
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
      '@': require('path').resolve(__dirname, 'src/renderer'),
    },
  },
};

