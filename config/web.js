var path = require('path');

module.exports = {
    server: {
        port: 3000,
        host: "http://localhost",
    },
    db: {
         //mongodb 配置
        DB_DEV: {
            url: 'mongodb://dbname:dbpwd@ip:port/db', //修改数据库配置 dbname 数据库账号 dbpwd 数据库密码
            options: {
            }
        },
        DB_TEST: {
            url: 'mongodb://dbname:dbpwd@ip:port/db',
            options: {
            }
        },
        DB_PRO: {
            url: 'mongodb://dbname:dbpwd@ip:port/db',
            options: {
            }
        }
    }
};

//    "server": "nodemon ./bin/www --exec babel-node --presets es2015,stage-2 -e js,jade",
