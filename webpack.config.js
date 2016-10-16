'use strict';

const isDevelopment             = process.env.NODE_ENV === 'development';
const webpack		            = require('webpack');
const DashboardPlugin           = require('webpack-dashboard/plugin');
const fs                        = require('fs');
const path                      = require('path');
const join                      = path.join;

const HtmlWebpackPlugin         = require('html-webpack-plugin');
const ExtractTextPlugin         = require('extract-text-webpack-plugin');
const AssetsPlugin              = require('assets-webpack-plugin');
const FaviconsWebpackPlugin     = require('favicons-webpack-plugin');
const BrowserSyncPlugin         = require('browser-sync-webpack-plugin');
const WriteFilePlugin           = require('write-file-webpack-plugin');
const CompressionPlugin         = require('compression-webpack-plugin');
const CopyWebpackPlugin         = require('copy-webpack-plugin');
const autoprefixer              = require('autoprefixer');

const projectRoot               = join(__dirname, './src');
const publicRoot                = join(__dirname, './dist');

module.exports = {
    context: projectRoot,
    entry: {
        index: './index'
    },

    output: {
        path: join(publicRoot, './assets'),
        publicPath: '/assets/',
        filename: isDevelopment ? '[name].js' : '[name].[hash:7].js',
        //library: '[name]',
        chunkFilename: isDevelopment ? '[id].js' : '[id].[chunkhash].js'
    },

    watch: isDevelopment,
    watchOptions: {
        aggreagateTimeout: 100
    },

    devtool: isDevelopment ? 'cheap-inline-module-source-map' : 'source-map',


    resolve: {
        modulesDirectories: ['node_modules', 'bower_components', 'libs'],
        alias: { },
        extensions: ['', '.js', '.less', '.styl', '.scss']
    },
    resolveLoader: {
        modulesDirectories: ['node_modules'],
        moduleTemplates: ['*-loader', '*'],
        extensions: ['', '.css', '.js']
    },

    module: {
        preLoaders: [
          {
                test: /\.js?$/,
                loaders: ['babel'],
                exclude: /(node_modules|bower_components)/
            }
        ],

        loaders: [
            {
                test: /\.pug$/,
                loader: 'pug'
            },
            {
                test: /\.css$/,
                loader: isDevelopment ? 'style!css!postcss' : ExtractTextPlugin.extract('style', 'css!postcss')
            },
            {
                test: /\.styl$/,
                loader: isDevelopment ? 'style!css!postcss!stylus' : ExtractTextPlugin.extract('style', 'css!postcss!stylus')
            },
            {
                test: /\.less$/,
                loader: isDevelopment ? 'style!css!postcss!less' : ExtractTextPlugin.extract('style', 'css!postcss!less')
            },
            {
                test: /\.(png|jpg|jpeg|svg|ttf|eot|woff|woff2)$/i,
                loaders: [
                    'url?name='+ (isDevelopment ? '[path][name]' : '[path][name].[hash:7]') + '.[ext]&limit=4096!image?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
                ]
            }
        ],
        postLoaders: [],
        noParse: [
        ]


    },

    postcss: function () {
        return [
            autoprefixer({
                browsers: ['ie > 9']
            })
        ];
    },

    plugins: [
        // new webpack.HotModuleReplacementPlugin(), // not need if in CLI --hot

        new webpack.NoErrorsPlugin(),

        new webpack.DefinePlugin({ NODE_ENV: JSON.stringify(process.env.NODE_ENV) }),

        new FaviconsWebpackPlugin({
            logo: join(projectRoot, 'logo.png'),
            prefix: 'favicons/', // '[hash]'
            emitStats: true,
            inject: true,
            statsFilename: 'favicons.json',
            background: '#ffffff',
            title: '2GIS на карточках',
            appName: '2GIS',
            appDescription: 'Разрабатывается новая версия 2ГИС. Было принято решение располагать весь контент на карточках.',
            developerName: 'Konstantin Aleksandrov',
            developerURL: 'https://github.com/koalex',
            index: 'https://2gis.ru',
            url:   'https://2gis.ru',
            silhouette: false,
            icons: {
                android: true,
                appleIcon: true,
                appleStartup: true,
                coast: true,
                favicons: true,
                firefox: true,
                opengraph: true,
                twitter: true,
                yandex: true,
                windows: true
            }
        }),

        new webpack.optimize.CommonsChunkPlugin({
            name: 'common',
            children: true,
            // chunks: ['index'],
            filename: isDevelopment ? '[name].js': '[name].[hash:7].js'
        }),

        new ExtractTextPlugin(isDevelopment ? '[name].css' : '[name].[contenthash:7].css', { allChunks: true }),

        new AssetsPlugin({
            filename: 'assets.json',
            path: join(publicRoot, './assets')
        }),

        new HtmlWebpackPlugin({
            template: 'index.pug', // Load a custom template (ejs by default see the FAQ for details)
            filename: 'index.html',
            inject: 'false', // Inject all assets into the given: true | 'head' | 'body' | false,
            chunks: ['common', 'index'],
            title: '2GIS на карточках', // in tpl => htmlWebpackPlugin.options.title
            siteUrl: 'https://2gis.ru', // in tpl => htmlWebpackPlugin.options.siteUrl
            siteName: '2GIS',
            siteDesc: 'Разрабатывается новая версия 2ГИС. Было принято решение располагать весь контент на карточках.',
            androidTopColor: '#a3cc4e',
            copyright: 'LLC "2GIS"',
            author: 'Konstantin Aleksandrov'
        }),
        new CopyWebpackPlugin([
            { from: projectRoot + '/old_ie.png', to: '/'+ publicRoot }
        ])

    ],
    devServer: {
        outputPath: join(publicRoot, './assets'),
        host: 'localhost',
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': '*',
            'Access-Control-Allow-Headers': '*'
        },
        port: 8080,
        hot: isDevelopment,
        historyApiFallback: {
            index: '/assets/index.html',
            rewrites: []
        }
    }

};

if (isDevelopment) {
    module.exports.plugins.push(
        new BrowserSyncPlugin(
            {
                host: 'localhost',
                port: 4000,
                // proxy the Webpack Dev Server endpoint
                // (which should be serving on http://localhost:8080/)
                // through BrowserSync
                proxy: 'http://localhost:8080/'
            },
            {
                // prevent BrowserSync from reloading the page
                // and let Webpack Dev Server take care of this
                reload: false
            }
        )
    );
    module.exports.plugins.push(
        new WriteFilePlugin({
            test: /favicons\.json$/,
            useHashIndex: true
        })
    );
    module.exports.plugins.push(new DashboardPlugin());

}


if (!isDevelopment) {
    module.exports.plugins.push(
        new CompressionPlugin({
            asset: '[path].gz[query]',
            algorithm: 'gzip',
            test: /\.js$|\.css$/,
            minRatio: 0.8
        })
    );
    module.exports.plugins.push(
        new webpack.optimize.UglifyJsPlugin({
            // test: /^((?!\app\.).)*\.js$/,
            test: /\.js?$/,
            //exclude // ебаный баг заставляет писать костыли https://github.com/webpack/webpack/issues/1079
            compress: {
                warnings: false,
                drop_console: true,
                unsafe: true
            }
        })
    );
}


