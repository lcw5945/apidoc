var path = require('path');

module.exports = {
    server: {
        port: 9013,
        host: "http://localhost",
    },
    db: {
        //mongodb 配置
        DB_DEV: {
            url: 'mongodb://admin:hefantv.123@47.93.89.11:28017/apidoc-dev',
            options: {
            }
        },
        DB_TEST: {
            url: 'mongodb://admin:hefantv.123@47.93.89.11:28017/apidoc-test',
            options: {
            }
        },
        DB_PRO: {
            url: 'mongodb://admin:hefantv.123@47.93.89.11:28017/apidoc',
            options: {
            }
        }
    }
};

//    "server": "nodemon ./bin/www --exec babel-node --presets es2015,stage-2 -e js,jade",
