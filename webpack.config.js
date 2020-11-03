const path = require('path');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const mode = 'development';

const plugins = [
  new HTMLWebpackPlugin({ template: './public/index.html' }),
  new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
];

if (mode === 'production') {
  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].bundle.[contenthash].css',
      linkType: 'text/css',
    })
  );
}

module.exports = {
  mode: mode,
  entry: {
    main: './src/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].bundle.[contenthash].js',
  },
  plugins: plugins,
  devtool: mode === 'production' ? 'source-map' : 'inline-source-map',
  optimization: {
    runtimeChunk: 'single',
    moduleIds: 'deterministic',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'modules',
          chunks: 'all',
        },
      },
    },
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    port: 3000,
    open: true,
    hot: true,
    compress: true,
    noInfo: true,
    clientLogLevel: 'silent',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'],
            },
          },
        ],
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        exclude: /node_modules/,
        use: [
          {
            loader:
              mode === 'production'
                ? MiniCssExtractPlugin.loader
                : 'style-loader',
          },
          {
            loader: 'css-loader',
          },
          { loader: 'sass-loader' },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        exclude: /node_modules/,
        use: ['file-loader'],
      },
      {
        test: /\.(woff2?|eot|ttf|otf)$/,
        exclude: /node_modules/,
        use: ['file-loader'],
      },
    ],
  },
};
