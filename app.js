const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');
const history = require('connect-history-api-fallback');
const index = require('./routes/index');
const api = require('./routes/api');
const mock = require('./routes/mock');

import './bin/mongdb';

const app = express();

const log4js = require('log4js');
log4js.configure({
    appenders: [
        {
            type: "console"
            , category: "console"
        },
        {
            type: 'file',
            filename: 'logs/access.log',
            maxLogSize: 1024,
            backups:4,
            category: 'console'
        }
    ],
    replaceConsole: true
});

// view engine setup
 //app.set('views', path.join(__dirname, ''));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
app.use(favicon(path.join(__dirname, 'static', 'favicon.ico')));
// app.use(function (req, res, next) {
//     console.log(req.headers)
//     next();
// });
app.use(history());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({ secret: 'hefantv',
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 3600000 }}))
app.use(express.static(path.join(__dirname, '/public'), {
    maxAge: 60*60*1000,
    etag: false
}));

app.use('/', index);
app.use('/api', api);
app.use('/mock', mock);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

console.log("start app");

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
