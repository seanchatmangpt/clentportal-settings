const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

const publicPath = isProduction
  ? 'https://storage.googleapis.com/client-app-revex-communities/clientportal/'
  : isStaging
  ? 'https://storage.googleapis.com/staging-client-app-revex-communities/clientportal/'
  : 'http://localhost:3040/';

module.exports = (env = {}) => ({
  mode: 'development',
  cache: false,
  devtool: isProduction ? 'hidden-source-map' : 'source-map',
  optimization: {
    minimize: isProduction ? true : false,
  },
  entry: './src/main.ts',
  output: {
    publicPath,
    chunkFilename: 'clientportal.[chunkhash].js',
    uniqueName: 'clientportalApp',
  },
  resolve: {
    extensions: ['.ts', '.vue', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      process: 'process/browser',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.svg$/,
        exclude: /node_modules/,
        loader: 'file-loader',
      },
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: { babelrc: true },
          },
          {
            loader: 'ts-loader',
            options: { appendTsSuffixTo: [/\.vue$/], transpileOnly: true },
          },
        ],
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(env),
    }),
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css',
    }),
    new ModuleFederationPlugin({
      name: 'clientPortalSettings',
      filename: 'remoteEntry.js',
      library: { type: 'var', name: 'clientPortalSettings' },
      exposes: {
        './AccountSetting': './src/pages/AccountSetting',
      },
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  devServer: {
    port: 3040,
    historyApiFallback: true,
  },
});
