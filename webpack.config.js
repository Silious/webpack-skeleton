const { resolve } = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const {SkeletonPlugin} = require('./skeleton');
module.exports = {
    mode: 'development',
    devtool: false,
    entry: './src/index.js',
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ["@babel/preset-env", "@babel/preset-react"]
                        }
                    }
                ],
                exclude: /node_modules/
            }
        ]
    },
    devServer: {
        contentBase: resolve(__dirname, 'dist')
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/index.html'
        }),
        new SkeletonPlugin({
            //我们要启动一个静态文件服务器，去显示dist目录里的页面。
            staticDir:resolve(__dirname,'dist'),
            port:8000,
            origin:'http://localhost:8000',
            device:'iPhone 6',
            defer:5000,
            button:{
                color:'#111'
            },
            image:{
                color:'#111'
            }
        })
    ]
}
