const path = require('path');

const config = {
  mode: 'production',

  entry: {
    main: path.resolve(__dirname, 'src/scripts', 'main.js'),
    inner: path.resolve(__dirname, 'src/scripts', 'inner.js'),
  },

  output: {
    filename: '[name].js',
  },

  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
};

module.exports = config;
