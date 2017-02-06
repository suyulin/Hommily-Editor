var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');
var definePlugin = new webpack.DefinePlugin({
    'process.env.NODE_ENV': '"development"',
});
module.exports = {
  devtool: 'eval',
  // 程序入口文件
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './app/main.js',
  ],
  // 打包文件存放位置
  output: {
    path: path.join(__dirname, 'dist'), // 打包好资源存放的位置
    filename: 'bundle.js', // 打包以后的文件名
    publicPath: '/static/', // 使用url-loader 加载资源的前缀
  },
  plugins: [
     new webpack.HotModuleReplacementPlugin(),
     new webpack.NoErrorsPlugin(),
     definePlugin,
     new ExtractTextPlugin('style.css', { allChunks: true }),
  ],
  module: {
    loaders: [{
      test: /\.js$/, // 用正则表达式匹配文件格式
      loaders: ['react-hot', 'babel'], // 加载器类型
      include: path.join(__dirname, 'app'),
    },
     { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
     { test: /\.svg$/, loader: 'url-loader?limit=10000&mimetype=image/svg+xml' },

    ]
  },
};
