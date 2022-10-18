const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StyleLintPlugin = require('stylelint-webpack-plugin');
const env = process.env;

module.exports = () => {
    return {
        entry: {index: './src/index.js'},
        stats: 'errors-warnings',
        resolve: {
            alias: {
                '@': path.resolve(process.cwd(), './src')
            },
            symlinks: false
        },
        plugins: [
            new CopyWebpackPlugin({
                patterns: [
                    {
                        from: './public', to: '',
                        globOptions: {
                            ignore: '.DS_Store,.gitignore,.gitkeep,.git/**,**/.git/**'.split(',')
                        }
                    }
                ]
            }),
            ...[
                new HtmlWebpackPlugin({
                    filename: './/index.html',
                    template: './src/templates/index.ejs',
                    title: undefined,
                    chunks: [ 'style', 'chunk-vendors', 'chunk-common', 'index' ],
                    env: 'production',
                    minify: false
                })
            ]
        ],
        optimization: {
            splitChunks: {
                cacheGroups: {
                    vendors: {
                        name: 'chunk-vendors',
                        test: /[\\/]node_modules[\\/]/,
                        priority: -10,
                        chunks: 'initial'
                    },
                    common: {
                        name: 'chunk-common',
                        minChunks: 2,
                        priority: -20,
                        chunks: 'initial',
                        reuseExistingChunk: true
                    },
                    styles: {
                        test: /[\\/]common[\\/].\.css$/,
                        name: 'style',
                        chunks: 'all',
                        enforce: true
                    }
                }
            },
            minimizer: [
                new TerserWebpackPlugin({
                    parallel: true,
                    extractComments: false,
                    terserOptions: {
                        ie8: false,
                        toplevel: true
                    }
                })
            ]
        },
        module: {
            rules: [
                {
                    test: /\.m?js$/,
                    // exclude: {
                    //     and: [/node_modules/], // Exclude libraries in node_modules ...
                    //     not: [
                    //         // Except for a few of them that needs to be transpiled because they use modern syntax
                    //         /@lerna-demo[\\/].*/,
                    //     ]
                    // },
                    // exclude: /node_modules\/(?!(@lerna-demo\/common)\/).*/,
                    exclude: /(node_modules|bower_components)/,
                    include: /node_modules\/@lerna-demo.*/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: [
                                [
                                    '@babel/preset-env',
                                    {
                                        corejs: 3,
                                        useBuiltIns: 'usage',
                                    }
                                ]
                            ],
                            plugins: [
                                '@babel/plugin-transform-runtime',
                                '@babel/plugin-transform-modules-commonjs'
                            ]
                        }
                    }
                },
                {
                    test: /\.ejs/,
                    loader: 'ejs-loader',
                    options: {
                        variable: 'props',
                        esModule: false
                    }
                },

                {
                    test: /\.less$/,
                    use: [
                        env.NODE_ENV !== 'production' ? 'style-loader' : {
                            loader: MiniCssExtractPlugin.loader,
                            options: {
                                publicPath: ''
                            }
                        },
                        'css-loader',
                        'less-loader'
                    ]
                },

                {
                    test: /\.(html)$/,
                    use: {
                        loader: 'html-loader',
                        options: {
                            attrs: [ 'img:src', 'img:data-src', 'audio:src' ]
                        }
                    }
                },
                {
                    test: /\.(png|svg|jpg|gif|webp)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                esModule: false,
                                outputPath: '/images',
                                limit: 10 * 1024,
                                name: '[name].[hash:8].[ext]'
                            }
                        }
                    ]
                }
            ]
        },
        output: {
            publicPath: '',
            filename: 'js/[name].[fullhash:8].js',
            path: path.resolve(__dirname, '../dist')
        }
    };
};
