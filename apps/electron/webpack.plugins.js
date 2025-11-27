const { VueLoaderPlugin } = require('vue-loader');

module.exports = [
  // Electron Forge 的 webpack 插件会自动处理 HTML 和脚本注入
  // 不需要手动配置 HtmlWebpackPlugin
  new VueLoaderPlugin(),
];

