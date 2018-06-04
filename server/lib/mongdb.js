import config from '../conf/web'
import debug from 'debug'
import mongoose  from 'mongoose'

const DB = process.env.NODE_ENV == "development" ? config.db.DB_DEV :
        (process.env.NODE_ENV == 'testing' ? config.db.DB_TEST : config.db.DB_PRO);

mongoose.set('debug', process.env.NODE_ENV == "development" || process.env.NODE_ENV == 'testing');


mongoose.Promise = global.Promise;
console.log(DB)
const {url, options} = DB;
const setting = Object.assign({useMongoClient: true}, options);
// console.log(url)


mongoose.connect(url, setting).then(
    () => {
        debug.log('Mongoose connection open to: ' + DB.url);
    },
    err => {
        debug.log('Mongoose connection error: ' + err);
    }
);