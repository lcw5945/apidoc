'use strict';

const autoprefixer = require('autoprefixer');
const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const InterpolateHtmlPlugin = require('react-dev-utils/InterpolateHtmlPlugin');
const SWPrecacheWebpackPlugin = require('sw-precache-webpack-plugin');
const eslintFormatter = require('react-dev-utils/eslintFormatter');
const ModuleScopePlugin = require('react-dev-utils/ModuleScopePlugin');
const paths = require('./paths');
const getClientEnvironment = require('./env');

const publicPath = paths.servedPath;
const shouldUseRelativeAssetPaths = publicPath === './';
const publicUrl = publicPath.slice(0, -1);
const env = getClientEnvironment(publicUrl);

const cssFilename = 'static/css/[name].[contenthash:8].css';

const extractTextPluginOptions = shouldUseRelativeAssetPaths
    ? {publicPath: Array(cssFilename.split('/').length).join('../')}
    : {};

module.exports = {
    bail: true,
    devtool: 'source-map',
    entry: [require.resolve('./polyfills'), paths.appIndexJs],
    output: {
        path: paths.appBuild,
        filename: 'static/js/[name].[chunkhash:8].js',
        chunkFilename: 'static/js/[name].[chunkhash:8].chunk.js',
        publicPath: publicPath,
        devtoolModuleFilenameTemplate: info =>
            path.relative(paths.appSrc, info.absoluteResourcePath),
    },
    resolve: {
        modules: ['node_modules', paths.appNodeModules].concat(
            // It is guaranteed to exist because we tweak it in `env.js`
            process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
        ),
        extensions: ['.js', '.json', '.jsx'],
        alias: {
            'babel-runtime': path.dirname(
                require.resolve('babel-runtime/package.json')
            ),
            'react-native': 'react-native-web',
        },
        plugins: [
            new ModuleScopePlugin(paths.appSrc),
        ],
    },
    module: {
        strictExportPresence: true,
        rules: [
            {
                test: /\.(js|jsx)$/,
                enforce: 'pre',
                use: [
                    {
                        options: {
                            formatter: eslintFormatter,
                            baseConfig: {
                                extends: [require.resolve('eslint-config-react-app')],
                            },
                            ignore: false,
                            useEslintrc: false,
                            // @remove-on-eject-end
                        },
                        loader: require.resolve('eslint-loader'),
                    },
                ],
                include: paths.appSrc,
            },
            {
                exclude: [
                    /\.html$/,
                    /\.(js|jsx)$/,
                    /\.css$/,
                    /\.json$/,
                    /\.bmp$/,
                    /\.gif$/,
                    /\.jpe?g$/,
                    /\.png$/,
                ],
                loader: require.resolve('file-loader'),
                options: {
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
                loader: require.resolve('url-loader'),
                options: {
                    limit: 10000,
                    name: 'static/media/[name].[hash:8].[ext]',
                },
            },
            {
                test: /\.(js|jsx)$/,
                include: paths.appSrc,
                loader: require.resolve('babel-loader'),
            },
            {
                test: /\.(less|css)$/,
                loader: ExtractTextPlugin.extract(
                    Object.assign(
                        {
                            fallback: require.resolve('style-loader'),
                            use: [
                                {
                                    loader: require.resolve('css-loader'),
                                    options: {
                                        importLoaders: 1,
                                        minimize: true,
                                        sourceMap: true,
                                    },
                                },
                                {
                                    loader: require.resolve('less-loader'),
                                },
                                {
                                    loader: require.resolve('postcss-loader'),
                                    options: {
                                        ident: 'postcss', // https://webpack.js.org/guides/migrating/#complex-options
                                        plugins: () => [
                                            require('postcss-flexbugs-fixes'),
                                            autoprefixer({
                                                browsers: [
                                                    '>1%',
                                                    'last 4 versions',
                                                    'Firefox ESR',
                                                    'not ie < 9', // React doesn't support IE8 anyway
                                                ],
                                                flexbox: 'no-2009',
                                            }),
                                        ],
                                    },
                                },
                            ],
                        },
                        extractTextPluginOptions
                    )
                ),
            },
        ],
    },
    plugins: [
        new InterpolateHtmlPlugin(env.raw),
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
            minify: {
                removeComments: true,
                collapseWhitespace: true,
                removeRedundantAttributes: true,
                useShortDoctype: true,
                removeEmptyAttributes: true,
                removeStyleLinkTypeAttributes: true,
                keepClosingSlash: true,
                minifyJS: true,
                minifyCSS: true,
                minifyURLs: true,
            },
        }),
        new webpack.DefinePlugin(env.stringified),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
                comparisons: false,
            },
            output: {
                comments: false,
            },
            sourceMap: true,
        }),
        new ExtractTextPlugin({
            filename: cssFilename,
        }),
        new ManifestPlugin({
            fileName: 'asset-manifest.json',
        }),
        new SWPrecacheWebpackPlugin({
            dontCacheBustUrlsMatching: /\.\w{8}\./,
            filename: 'service-worker.js',
            logger(message) {
                if (message.indexOf('Total precache size is') === 0) {
                    // This message occurs for every build and is a bit too noisy.
                    return;
                }
                console.log(message);
            },
            minify: true,
            navigateFallback: publicUrl + '/index.html',
            navigateFallbackWhitelist: [/^(?!\/__).*/],
            staticFileGlobsIgnorePatterns: [/\.map$/, /asset-manifest\.json$/],
            stripPrefix: paths.appBuild.replace(/\\/g, '/') + '/',
        }),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ],
    node: {
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
};
