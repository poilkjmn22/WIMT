const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const ejs = require('ejs');

const _ = require('lodash');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const UglifyjsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

const {
    AutoWebPlugin
} = require('web-webpack-plugin');

const HappyPack = require('happypack');
const os = require('os');
const happyThreadPool = HappyPack.ThreadPool({
    size: os.cpus().length
});

const PUBLIC_PATH = '/dist/';

const autoWebPlugin = new AutoWebPlugin('./HtmlTemplates/AutoWebPlugin', {
    template: path.resolve(__dirname, 'HtmlTemplates/ejs/layout.ejs'),
    // 定义一个函数，告诉你当前页面的 pageName 和 使用的模版的 文件完整路径 templateFullPath，你返回一个模版引擎处理后的HTML字符串内容。
    templateCompiler: function(pageName, templateFullPath) {
        const ejsTemplate = fs.readFileSync(templateFullPath, {
            encoding: 'utf8',
        });

        return ejs.render(ejsTemplate, {
            title: '首页',
            mainContainerID: _.kebabCase(pageName),
            publicPath: '/'
        }, {
            root: path.resolve(__dirname, 'HtmlTemplates/ejs/')
        });
    },
    filename: function(pageName) {
        return _.kebabCase(pageName);
    },
    outputPagemap: true
});

module.exports = {
    entry: autoWebPlugin.entry({}),
    // devtool: 'eval',
    mode: 'production',
    module: {
        rules: [{
                test: /\.css$/,
                // use: 'happypack/loader?id=happyCss'
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            },
            {
                test: /\.js$/,
                // loader: 'babel-loader',
                use: 'happypack/loader?id=happyBabel',
                exclude: /node_modules/
            },
            {
                test: /\.vue$/,
                use: 'vue-loader'
            },
            {
                test: /\.(ttf|woff|woff2|eot|svg|jpg|png)$/,
                loader: 'file-loader'
            }
        ]
    },
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
        })],
        // splitChunks: {
        //     cacheGroups: {
        //         commons: {
        //             name: 'commons',
        //             test: /[\\/]node_modules[\\/]/,
        //             chunks: 'all'
        //         }
        //     }
        // }
    },
    plugins: [
        new CleanWebpackPlugin(['dist']),
        new HappyPack({
            //用id来标识 happypack处理那里类文件
            id: 'happyBabel',
            //如何处理  用法和loader 的配置一样
            loaders: [{
                loader: 'babel-loader?cacheDirectory=true',
            }],
            //共享进程池
            threadPool: happyThreadPool,
            //允许 HappyPack 输出日志
            verbose: true,
        }),
        new VueLoaderPlugin(),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].[chunkhash].bundle.css",
            chunkFilename: "[id].css",
            publicPath: PUBLIC_PATH
        }),
        autoWebPlugin,
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./vendor-manifest.json') // 指向生成的json文件
        }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(true),
            AUTH_DATA_KEY: JSON.stringify('authData')
        }),
        new CompressionPlugin(),
        new BundleAnalyzerPlugin({
            analyzerHost: 'localhost',
            analyzerPort: 5000,
            // defaultSizes: ['stat', 'parsed', 'gzip'],
            openAnalyzer: false
        }),
    ],

    resolve: {
        mainFields: ['main'],
        alias: {
            Components: './components'
        },
        extensions: ['.js', '.vue'],
        modules: ['node_modules']
    },
    externals: {
    },
    output: {
        // filename: '[name].bundle.js',
        filename: '[name].[chunkhash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: PUBLIC_PATH
    }
};
