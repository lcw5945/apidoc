/**
 * Created by user on 2018/2/23.
 */
import express from 'express'
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import session from 'express-session';
const history = require('hefantv-history');
const logger = require('morgan');
import api from './routes/v1/index'
import mock from './routes/v1/mock'
import webConf from './conf/web'
import Log from 'hefan-debug-log-s'
import path from 'path'

import './lib/ws-server'
import './lib/mongdb'

const rootPath = path.resolve(process.cwd())
const staticPath = rootPath + '/public'

const app = express()

app.use(history());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'hefantv',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }}))
app.use(express.static(staticPath, {
    maxAge: 60*60*1000,
    etag: false
}));
app.set('view engine','jade')

//port
// router
app.use('/api', api)
app.use('/mock', mock)

/*app.use('/', index);
app.use('/api', api2);
app.use('/mock', mock);*/

Log.config('c5dfe3ddf76c0777c44b73f08bf1d0b8', process.env.NODE_ENV)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});


Log.log(`start app, public path ${staticPath}`);

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

// managerShell.start()

module.exports = app;