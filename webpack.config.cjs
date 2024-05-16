const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container;
const webpack = require('webpack');

const isProduction = process.env.NODE_ENV === 'production';
const isStaging = process.env.NODE_ENV === 'staging';

const publicPath = isProduction
  ? 'https://preview-internal.clientclub.net/'
  : isStaging
  ? 'https://staging.preview-internal.clientclub.net/'
  : 'http://localhost:3040/';

module.exports = (env = {}) => ({
  mode: 'development',
  cache: false,
  devtool: isProduction ? 'hidden-source-map' : 'source-map',
  optimization: {
    minimize: isProduction ? true : false,
  },
  entry:'./src/main.ts', // Main entry point
    
  output: {
    publicPath,
    chunkFilename: 'clientportal.[chunkhash].js',
    uniqueName: 'clientportalSettings',
  },
  resolve: {
    extensions: ['.ts', '.vue', '.jsx', '.js', '.json'],
    alias: {
      '@': path.resolve(__dirname, 'src'),
      process: 'process/browser',
       
    },
  },
 
  // optimization: {
  //   splitChunks: {
  //     chunks: 'all',
  //     minSize: 0,
  //   },
  // },


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
        test: /\.html$/,
        use: 'html-loader',
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
    new CopyWebpackPlugin({
      patterns: [
        { from: './public/main-sw.js', to: 'main-sw.js' },
        { from: './public/clientclub-sw.js', to: 'clientclub-sw.js' },
        { from: './public/firebase-messaging-sw.js', to: 'firebase-messaging-sw.js' },
        { from: './public/manifest.json', to: 'manifest.json' },
      ],
    }),
    
    new ModuleFederationPlugin({
      name: 'clientPortalSettings',
      filename: 'remoteEntry.js',
      exposes: {
        "./AccountSetting": "./src/components/account/AccountSettings.vue",
      },
      // remotes: {
      //   clientPortalPreview: 'clientPortalPreview@http://localhost:3030/remoteEntry.js',
      // }
    }),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, './index.html'),
      chunks: ['main'],
    }),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: false,
      __VUE_PROD_DEVTOOLS__: false,
    }),
  ],
  devServer: {
    static: {
      directory: path.join(__dirname),
    },
    port: 3040,
    historyApiFallback: true,
    hot: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization',
    },
  },
 
});
