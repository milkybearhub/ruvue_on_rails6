const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const ManifestPlugin = require('webpack-manifest-plugin')

module.exports = (env, argv) => {
  const IS_DEV = argv.mode === 'development'

  return {
    entry: {
      main: './frontend/application.js'
    },
    // devtool: IS_DEV ? 'source-map' : 'none',  // HMRが重くなる原因なので外した方がいい。
    output: {
      filename: 'javascripts/bundle/[name]-[hash].js',
      path: path.resolve(__dirname, 'app/assets')
    },
    plugins: [
      new VueLoaderPlugin(),
      new MiniCssExtractPlugin({
        filename: 'stylesheets/bundle/[name]-[hash].css'
      }),
      new webpack.HotModuleReplacementPlugin(),
      new ManifestPlugin({
        writeToFileEmit: true
      })
    ],
    module: {
      rules: [
        {
          test: /\.js$/,
          exclude: /node_modules/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        },
        {
          test: /\.vue$/,
          loader: 'vue-loader'
        },
        {
          test: /\.pug/,
          loader: 'pug-plain-loader'
        },
        {
          test: /\.(c|sc)ss$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
              options: {
                publicPath: path.resolve(
                  __dirname,
                  'app/assets/stylesheets/bundle'
                )
              }
            },
            'css-loader',
            'sass-loader'
          ]
        },
        {
          test: /\.(jpg|png|gif)$/,
          loader: 'file-loader',
          options: {
            name: '[name]-[hash].[ext]',
            outputPath: 'images/bundle',
            publicPath: function (path) {
              return 'images/bundle/' + path
            }
          }
        }
      ]
    },
    resolve: {
      alias: {
        vue: 'vue/dist/vue.js'
      },
      extensions: ['.js', '.scss', 'css', '.vue', '.jpg', '.png', '.gif', ' ']
    },
    optimization: {
      splitChunks: {
        cacheGroups: {
          vendor: {
            test: /.(c|sa)ss/,
            name: 'style',
            chunks: 'all',
            enforce: true
          }
        }
      }
    },
    devServer: {
      host: 'localhost',
      port: 3035,
      publicPath: 'http://localhost:3035/app/assets/',
      contentBase: path.resolve(__dirname, 'app/assets'),
      hot: true,
      disableHostCheck: true,
      historyApiFallback: true
    }
  }
}
