var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
module.exports = {

  // 程序入口文件
  entry: [
    './app/main.js',
  ],
  // 打包文件存放位置
  
  output: {
    path: path.join(__dirname, 'dist'), // 打包好资源存放的位置
    filename: 'bundle.js', // 打包以后的文件名
    publicPath: '/static/', // 使用url-loader 加载资源的前缀
  },
  plugins: [
     new ExtractTextPlugin('style.css', { allChunks: true }),
     new webpack.DefinePlugin({'process.env.NODE_ENV': '"production"'}),
      new webpack.optimize.UglifyJsPlugin({
      test: /(\.jsx|\.js)$/,
      compress: {
        warnings: false
      },
    })
  ],
    postcss: [
    require('autoprefixer-core'),
    require('postcss-color-rebeccapurple'),
  ],
  module: {
    loaders: [{
      test: /\.js$/, // 用正则表达式匹配文件格式
      loaders: ['react-hot', 'babel'], // 加载器类型
      include: path.join(__dirname, 'app'),
    },
     { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader?modules&importLoaders=1&localIdentName=[name]__[local]___[hash:base64:5]!postcss-loader') },
     { test: /\.svg$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },

    ]
  },
};
