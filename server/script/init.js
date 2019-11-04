require("babel-register")({
    cache: false,
    babelrc: false,
    presets: ["es2015", "stage-0"],
});
require('babel-polyfill');
// 设置环境变量
process.env.NODE_ENV = "development"

require('./app')