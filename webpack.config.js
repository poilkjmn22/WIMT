const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const fs = require('fs');
const ejs = require('ejs');

const _ = require('lodash');

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
            title: 'Where is my time?',
            mainContainerID: _.kebabCase(pageName),
            publicPath: '/'
        }, {
            root: path.resolve(__dirname, 'HtmlTemplates/ejs/')
        });
    },
    filename: 'index.html',
    outputPagemap: true
});

var bodyParser = require('body-parser');
const WIMTBLL = require('./server/BLL/WIMTBLL.js')

module.exports = {
    entry: autoWebPlugin.entry({
        // commonCss: ['./assets/font-RTC-monitor/iconfont.css', './css/index.css']
    }),
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [{
                test: /\.css$/,
                // use: 'happypack/loader?id=happyCss'
                // use: [MiniCssExtractPlugin.loader, 'css-loader']
                use: ['vue-style-loader', 'css-loader']
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
            },
            {
                test: require.resolve('snapsvg/dist/snap.svg.js'),
                use: 'imports-loader?this=>window,fix=>module.exports=0',
            }
        ]
    },
    // optimization: {
    //     splitChunks: {
    //         cacheGroups: {
    //             commons: {
    //                 name: 'commons',
    //                 test: /[\\/]node_modules[\\/]/,
    //                 chunks: 'all'
    //             }
    //         }
    //     }
    // },
    plugins: [
        // new CleanWebpackPlugin(['dist']),
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
            filename: "[name].[hash].bundle.css",
            chunkFilename: "[id].css",
            publicPath: PUBLIC_PATH
        }),
        autoWebPlugin,
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./vendor-manifest.json') // 指向生成的json文件
        }),
        new webpack.DefinePlugin({
            PRODUCTION: JSON.stringify(false),
            AUTH_DATA_KEY: JSON.stringify('authData'),
            // SID: JSON.stringify('sid')
        }),
        new webpack.HotModuleReplacementPlugin(),
    ],

    resolve: {
        mainFields: ['main'],
        alias: {
            Components: './components'
        },
        extensions: ['.js', '.vue', '.json'],
        modules: ['node_modules']
    },
    output: {
        // filename: '[name].bundle.js',
        filename: '[name].[hash].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: PUBLIC_PATH
    },
    externals: {},
    devServer: {
        publicPath: PUBLIC_PATH,
        // index: './dist/index1.html',
        compress: false,
        port: 8090,
        hot: true,
        // host: '192.168.20.16',
        host: '192.168.10.147',
        proxy: {
            '/class_in': 'http://192.168.10.141:9090'
            // '/class_in': 'http://192.168.10.253:9090'
        },
        setup: function(app, server) {
            app.use(bodyParser.json())
            app.use(bodyParser.urlencoded({
                extended: true
            }));

            app.get('/getActivityList', (req, res) => {
                WIMTBLL.getActivityList(results => {
                    res.json(results)
                })
                // res.json(require('./json/WIMTList.json'))
            })
            app.get('/getActivityClassList', (req, res) => {
                WIMTBLL.getActivityClassList(results => {
                    res.json(results)
                })
                // res.json(require('./json/WIMTList.json'))
            })

            app.put('/addActivityRound', (req, res) => {
                WIMTBLL.addActivityRound(req.body, (results) => {
                  res.json(results)
                })
            })

            app.put('/deleteActivity', (req, res) => {
                WIMTBLL.deleteActivity(req.body, (results) => {
                  res.json(results)
                })
            })

            app.put('/restoreActivity', (req, res) => {
                WIMTBLL.restoreActivity(req.body, (results) => {
                  res.json(results)
                })
            })

            app.get('/getActivityRound', (req, res) => {
                WIMTBLL.getActivityRound(req.query, results => {
                    res.json(results)
                })
            })

            app.put('/updateActivityRound', (req, res) => {
                WIMTBLL.updateActivityRound(req.body, (results) => {
                  res.json(results)
                })
            })

        }
    }
};
