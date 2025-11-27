module.exports = [
  // Add support for native node modules
  {
    // We're specifying native_modules in the test because the asset relocator
    // generator generates a "fake" .node file which is really a cjs file.
    test: /native_modules[/\\].+\.node$/,
    use: 'node-loader',
  },
  {
    test: /[/\\]node_modules[/\\].+\.(m?js|node)$/,
    parser: { amd: false },
    resolve: {
      fullySpecified: false,
    },
    type: 'javascript/auto',
  },
  {
    test: /\.tsx?$/,
    exclude: /(node_modules|\.webpack)/,
    use: {
      loader: 'ts-loader',
      options: {
        transpileOnly: true,
        appendTsSuffixTo: [/\.vue$/],
      },
    },
  },
];

