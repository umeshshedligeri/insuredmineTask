var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const mongoose = require('mongoose');
const db = require("./config/db")


var indexRouter = require('./routes/index');

var app = express();

mongoose.connect(db.dbUrl, db.config)
  .then(() => console.log("Connected to Mongoose : db.js"))
  .catch(err => console.log(err));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



require(__dirname+"/processor-usage.js").startWatching();

var shouldRun = true;
var desiredLoadFactor = .5;

function blockCpuFor(ms) {
    var now = new Date().getTime();
    var result = 0
    while(shouldRun) {
        result += Math.random() * Math.random();
        if (new Date().getTime() > now +ms)
            return;
    }   
}

function start() {
    shouldRun = true;
    blockCpuFor(1000*desiredLoadFactor);
    setTimeout(start, 1000* (1 - desiredLoadFactor));
}

setInterval(function() {
    console.log("current process cpu usage: "+(global.processCpuUsage || 0)+"%");}
, 1000);

if (process.argv[2]) {
    var value = parseFloat(process.argv[2]);
    if (value < 0 || value > 1) {
        console.log("please give desired load value as a range [0..1]");
    process.exit(-1);
    } else {
        desiredLoadFactor = value;
    }
}
start();
module.exports = app;
