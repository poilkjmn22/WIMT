var path = require("path");
var webpack = require("webpack");

const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
// var es3ifyPlugin = require('es3ify-webpack-plugin');

const vendors = [
    'babel-polyfill',
    'vue',
    'axios'
];
module.exports = {
    // 要打包的模块的数组
    entry: {
        vendor: vendors
    },
    output: {
        path: path.resolve(__dirname, 'build/dll'), // 打包后文件输出的位置
        filename: '[name].dll.js', // vendor.dll.js中暴露出的全局变量名。
        library: '[name]_library' // 与webpack.DllPlugin中的`name: '[name]_library',`保持一致。
    },
    module: {
        rules: [{
                test: /\.css$/,
                // use: 'happypack/loader?id=happyCss'
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg)$/,
                loader: 'file-loader'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
            }
        ]
    },
    plugins: [
        new MiniCssExtractPlugin({      
            filename: '[name].dll.css'    
        }),
        new webpack.DllPlugin({
            path: path.join(__dirname, '', '[name]-manifest.json'),
            name: '[name]_library',
            context: __dirname
        }),
        // new es3ifyPlugin()
    ],
    optimization: {
        minimizer: [new UglifyjsPlugin({
            uglifyOptions: {
                compress: {
                    // 在UglifyJs删除没有用到的代码时不输出警告
                    warnings: false,
                    // 删除所有的 `console` 语句，可以兼容ie浏览器
                    drop_console: true,
                    // 内嵌定义了但是只用到一次的变量
                    collapse_vars: true,
                    // 提取出出现多次但是没有定义成变量去引用的静态值
                    reduce_vars: true
                }
            },
            extractComments: true
        })]
    }
};
