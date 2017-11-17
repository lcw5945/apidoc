/**
 * Created by Cray on 2017/3/17.
 */
import config from '../config/web';
const debug = require('debug');
const mongoose = require('mongoose'),
    DB = process.env.NODE_ENV == "development" ? config.db.DB_DEV :
        (process.env.NODE_ENV == 'testing' ? config.db.DB_TEST : config.db.DB_PRO);

mongoose.Promise = global.Promise;

const {url, options} = DB;
const setting = Object.assign({}, {useMongoClient: true}, options);
console.log(url)
mongoose.connect(url, setting).then(
    () => {
        debug.log('Mongoose connection open to: ' + DB.url);
    },
    err => {
        debug.log('Mongoose connection error: ' + err);
    }
);
