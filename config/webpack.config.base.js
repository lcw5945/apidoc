/**
 * Created by Cray on 2017/7/20.
 */

const autoprefixer = require("autoprefixer");
const path = require("path");
const webpack = require("webpack");
const eslintFormatter = require("react-dev-utils/eslintFormatter");
const InterpolateHtmlPlugin = require("react-dev-utils/InterpolateHtmlPlugin");
const ModuleScopePlugin = require("react-dev-utils/ModuleScopePlugin");
const getClientEnvironment = require("./env");
const paths = require("./paths");

const publicPath = "/";
const publicUrl = "";
const env = getClientEnvironment(publicUrl);

module.exports = {
  devtool: "eval",
  output: {
    path: paths.appBuild,
    filename: "static/js/bundle.js",
    chunkFilename: "static/js/[name].chunk.js",
    publicPath: publicPath,
    devtoolModuleFilenameTemplate: info =>
      path.resolve(info.absoluteResourcePath)
  },
  resolve: {
    modules: ["node_modules", paths.appNodeModules].concat(
      process.env.NODE_PATH.split(path.delimiter).filter(Boolean)
    ),
    extensions: [".js", ".json", ".jsx"],
    alias: {
      "babel-runtime": path.dirname(
        require.resolve("babel-runtime/package.json")
      ),
      "~actions": path.resolve(__dirname, "../src/actions"),
      "~components": path.resolve(__dirname, "../src/components"),
      "~containers": path.resolve(__dirname, "../src/containers"),
      "~constants": path.resolve(__dirname, "../src/constants"),
      "~pages": path.resolve(__dirname, "../src/pages"),
      "~reducers": path.resolve(__dirname, "../src/reducers"),
      "~utils": path.resolve(__dirname, "../src/utils"),
      "~plugins": path.resolve(__dirname, "../src/plugins"),
      "~api": path.resolve(__dirname, "../src/api"),
      "~lib": path.resolve(__dirname, "../src/lib"),
      "~common": path.resolve(__dirname, "../src/common")
    },
    plugins: [new ModuleScopePlugin(paths.appSrc)]
  },
  module: {
    strictExportPresence: true,
    rules: [
      // {
      //     test: /\.(js|jsx)$/,
      //     enforce: 'pre',
      //     use: [
      //         {
      //             options: {
      //                 formatter: eslintFormatter,
      //                 baseConfig: {
      //                     extends: [require.resolve(path.resolve(__dirname, "../config/eslint-config-react"))],
      //                 },
      //                 ignore: false,
      //                 useEslintrc: false
      //             },
      //             loader: require.resolve('eslint-loader'),
      //         },
      //     ],
      //     include: paths.appSrc,
      // },
      {
        exclude: [
          /\.html$/,
          /\.(js|jsx)$/,
          /\.css$/,
          /\.less$/,
          /\.json$/,
          /\.bmp$/,
          /\.gif$/,
          /\.jpe?g$/,
          /\.png$/
        ],
        loader: require.resolve("file-loader"),
        options: {
          name: "static/media/[name].[hash:8].[ext]"
        }
      },
      {
        test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/],
        loader: require.resolve("url-loader"),
        options: {
          limit: 10000,
          name: "static/media/[name].[hash:8].[ext]"
        }
      },
      {
        test: /\.(js|jsx)$/,
        include: paths.appSrc,
        exclude: /node_modules/,
        loader: "babel-loader?cacheDirectory=true"
      },
      {
        test: /\.(less|css)$/,
        use: [
          require.resolve("style-loader"),
          {
            loader: require.resolve("css-loader"),
            options: {
              importLoaders: 1
            }
          },
          {
            loader: require.resolve("postcss-loader"),
            options: {
              ident: "postcss", // https://webpack.js.org/guides/migrating/#complex-options
              plugins: () => [
                require("postcss-flexbugs-fixes"),
                autoprefixer({
                  browsers: [
                    ">1%",
                    "last 4 versions",
                    "Firefox ESR",
                    "not ie < 9" // React doesn't support IE8 anyway
                  ],
                  flexbox: "no-2009"
                })
              ]
            }
          },
          {
            loader: require.resolve("less-loader"),
            options: {
              modifyVars: { "@primary-color": "#1DA57A" }
            }
          }
        ]
      }
    ]
  },
  plugins: [
    new InterpolateHtmlPlugin(env.raw),
    new webpack.ProvidePlugin({
      _: "lodash",
      "window._": "lodash",
      Log: "hefan-log"
    })
  ],
  node: {
    fs: "empty",
    net: "empty",
    tls: "empty"
  }
};
