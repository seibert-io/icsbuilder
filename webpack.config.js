var path = require('path')
var webpack = require('webpack')
var UglifyJSPlugin = require('uglifyjs-webpack-plugin')
var ExtractTextPlugin = require('extract-text-webpack-plugin')
var SpritePlugin = require('svg-sprite-loader/plugin');

module.exports = {
    entry: './src/vue/main.js',
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: './',
        filename: 'main.js'
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            },
            {
                test: /\.(js|vue)$/,
                enforce: 'pre',
                loader: 'eslint-loader',
                exclude: '/node_modules/'
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(png|jpg|gif)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.svg$/,
                use: [
                    'svg-sprite-loader',
                    'svgo-loader'
                ]
            },
            {
                test: /\.(eot|ttf|woff|woff2)$/,
                loader: 'file-loader'
            }
        ]
    },
    resolve: {
        alias: {
            'vue$': 'vue/dist/vue.esm.js'
        },
        extensions: [".webpack.js", ".web.js", ".js", ".json", ".vue"]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true
    },
    performance: {
        hints: false
    },
    plugins: [
        new SpritePlugin()
    ],
    devtool: '#eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
    module.exports.devtool = '#source-map'
    // http://vue-loader.vuejs.org/en/workflow/production.html
    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            }
        }),
        new UglifyJSPlugin({
            sourceMap: true,
            uglifyOptions: {
                compress: {
                    warnings: false
                }
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        }),
        new ExtractTextPlugin('screen.css', {
            allChunks: true
        })
    ])

    module.exports.module.rules.push({
        test: /\.scss$/,
        use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            //resolve-url-loader may be chained before sass-loader if necessary
            use: ['css-loader', 'sass-loader']
        })
    })
} else {

    module.exports.plugins = (module.exports.plugins || []).concat([
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"development"'
            }
        })
    ])

    module.exports.module.rules.push({
        test: /\.scss$/,
        loaders: ['style-loader',
            {
                loader: 'css-loader',
                options: {
                    sourceMap: true
                }
            },
            {
                loader: 'sass-loader',
                options: {
                    sourceMap: true,
                    includePaths: [path.resolve(__dirname, './node_modules')]
                }
            }]
    })
}
