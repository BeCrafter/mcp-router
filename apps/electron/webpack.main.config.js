module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/main.ts',
  // Put your normal webpack config below here
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  // 抑制已知的警告（这些是正常的动态依赖，不影响功能）
  ignoreWarnings: [
    {
      module: /better-sqlite3/,
      message: /Critical dependency: require function is used in a way in which dependencies cannot be statically extracted/,
    },
    {
      module: /express/,
      message: /Critical dependency: the request of a dependency is an expression/,
    },
  ],
  // 配置 externals，让 better-sqlite3 作为外部依赖处理
  externals: {
    'better-sqlite3': 'commonjs better-sqlite3',
  },
};

