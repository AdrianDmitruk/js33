const { resolve } = require('path')
require('dotenv').config()
const { EnvironmentPlugin } = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { TsconfigPathsPlugin } = require('tsconfig-paths-webpack-plugin')
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: {
    sw: './service_worker/index.ts',
    app: {
      dependOn: 'sw',
      import: './src/index.ts'
    }
  },
  plugins: [
    new EnvironmentPlugin([]),
    new HtmlWebpackPlugin({
      template: './public/index.html'
    }),
    new ForkTsCheckerWebpackPlugin(),
    new ESLintPlugin({
      emitError: true,
      emitWarning: true,
      failOnError: true,
      extensions: ['.ts', '.js']
    })
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)$/,
        loader: 'esbuild-loader',
        options: {
          target: 'es2015'
        }
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        include: resolve(__dirname, 'src/assets'),
        type: 'asset/resource'
      }
    ]
  },
  resolve: {
    symlinks: false,
    extensions: ['.ts', '.js'],
    plugins: [new TsconfigPathsPlugin()]
  },
  optimization: {
    splitChunks: {
      chunks: 'async'
    }
  }
}
