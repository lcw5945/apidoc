const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const WatchMissingNodeModulesPlugin = require('react-dev-utils/WatchMissingNodeModulesPlugin');
const getClientEnvironment = require('./env');
const paths = require('./paths');
const baseWebpackConfig = require('./webpack.config.base');
const merge = require('webpack-merge');

const publicUrl = '';
const env = getClientEnvironment(publicUrl);

module.exports = merge(baseWebpackConfig, {
    devtool: 'eval',
    entry: [
        require.resolve('react-hot-loader/patch'),
        require.resolve('react-dev-utils/webpackHotDevClient'),
        require.resolve('./polyfills'),
        require.resolve('react-error-overlay'),
        paths.appIndexJs,
    ],
    plugins: [
        new HtmlWebpackPlugin({
            inject: true,
            template: paths.appHtml,
        }),
        new webpack.DefinePlugin(Object.assign({}, env.stringified, {
            __DEV: true
        })),
        new webpack.HotModuleReplacementPlugin(),
        new CaseSensitivePathsPlugin(),
        new WatchMissingNodeModulesPlugin(paths.appNodeModules),
        new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    ]
});
