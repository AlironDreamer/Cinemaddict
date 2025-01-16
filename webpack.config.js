import path from 'path';
import CopyPlugin from "copy-webpack-plugin";

export default {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve('build'),
    clean: true
  },
  devtool: 'source-map',
  plugins: [
    new CopyPlugin({
      patterns: [{ from: 'public' }],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: ['babel-loader']
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    fallback: {
      url: false,
      path: false,
    },
  }
};
