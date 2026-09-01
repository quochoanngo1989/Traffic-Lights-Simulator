// Copyright (c) 2019 Uber Technologies, Inc.
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in
// all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
// THE SOFTWARE.

/* eslint-disable no-process-env */
const {resolve} = require('path');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
//const CopyPlugin = require('copy-webpack-plugin');
const BABEL_CONFIG = {
  presets: ['@babel/preset-env', '@babel/preset-react'],
  plugins: ['@babel/proposal-class-properties']
};

const CONFIG = {
  mode: 'development',
  /*entry: {
    //app: resolve('./src/app.js')
    main: resolve('./src/app.js')
  },*/
  entry: path.resolve(__dirname, './src/app.js'),
  devtool: 'source-map',
  output: {
    path: resolve('./dist'),
    filename: 'bundle.js'
  },
  resolve: {
    fallback: {
      assert: require.resolve('assert/'),
      //process: require.resolve('process/browser'),
      process: require.resolve('process') ,
      util: require.resolve('util/'),
      path: require.resolve('path-browserify'),
      stream: require.resolve('stream-browserify'),
      buffer: require.resolve('buffer/')
    },
    extensions: ['.*','.js', '.jsx', '.ts', '.tsx', '.json'], // Các phần mở rộng mà Webpack sẽ tự động tìm kiếm
  },
  module: {
    noParse: /(mapbox-gl)\.js$/,
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        // Compile ES2015 using bable
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        options: BABEL_CONFIG
      },
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react'],
          },
        },
      },
    ]
  },
  plugins: [
    /*new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, 'modules/core/src/components/log-viewer/assets'), // Source folder
          to: path.resolve(__dirname, 'dist/assets'),
        }
      ],
    }),*/
    new webpack.HotModuleReplacementPlugin(),
    //new webpack.EnvironmentPlugin(['MapboxAccessToken']),
    new webpack.EnvironmentPlugin({
      MAPBOX_ACCESS_TOKEN: process.env.MAPBOX_ACCESS_TOKEN || ''
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html', // Path to your index.html file
    }),
    /*new webpack.ProvidePlugin({
      process: 'process/browser',  // Automatically make process available globally
    }),*/
    new webpack.ProvidePlugin({
      process: 'process',  // Automatically make process available globally
    }),
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
    })
  ],
  devServer:{
    static: {
      directory: path.join(__dirname, 'public'),
    },
    host: '0.0.0.0',
    port: 8082,
    hot: true,
    liveReload: true, 
    open: true
  },
};

module.exports = (env = {}) => {
  let config = Object.assign({}, CONFIG);

  // This switch between streaming and static file loading
  config.plugins = config.plugins.concat([
    new webpack.DefinePlugin({__IS_STREAMING__: JSON.stringify(Boolean(env.stream))}),
    new webpack.DefinePlugin({__IS_LIVE__: JSON.stringify(Boolean(env.live))})
  ]);

  //if (env.local) 
    {
    // This line enables bundling against src in this repo rather than installed module
    config = require('./webpack.config.local')(config)(env);
  }

  return config;
};
