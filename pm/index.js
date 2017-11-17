require("babel-register")({
    cache: false,
    babelrc: false,
    presets: ["es2015", "stage-0"],
});
require('babel-polyfill');
require('../bin/www');