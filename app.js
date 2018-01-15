var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var adminPages = require('./routes/admin');
var user = require('./user');
var admin = require('./admin');
var app = express();

var mongoose = require('mongoose');
mongoose.Promise = global.Promise;
mongoose.connection.on('disconnected', () => { console.log('-> lost connection'); throw 0; });
mongoose.connection.on('reconnect', () => { console.log('-> reconnected'); });
mongoose.connection.on('connected', () => { console.log('-> connected'); });
mongoose.connect('mongodb://127.0.0.1:27017/db', {useMongoClient: true});
mongoose.set('debug', true);

var User = require('./Model/User');
var Admin = require('./Model/Admin');

// view engine setup

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

var userAuth = function(req, res, next) {
  if (req.url.match(/^\/u\//)) {
    var username = req.cookies.username;
    var token = req.cookies.token;
    User.findOne({username: username}, 'token', function(err, user) {
      if (err) {
        res.cookie('username', '', { expires: new Date() });
        res.cookie('token', '', { expires: new Date() });
        res.redirect('/Login');
        console.log(err);
      } else if (!user || user.token != token) {
        res.cookie('username', '', { expires: new Date() });
        res.cookie('token', '', { expires: new Date() });
        res.redirect('/Login');
      } else {
        req.body.username = username;
        next();
      }
    });
  }
  else next();
};
app.use(userAuth);

app.use('/', user);
app.use('/', index);

var adminAuth = function(req, res, next) {
  if (req.url.match(/^\/admin\/a\//)) {
    var name = req.cookies.name;
    var token = req.cookies.token;
    Admin.findOne({name: name}, 'token', function(err, admin) {
      if (err) {
        res.cookie('name', '', { expires: new Date() });
        res.cookie('token', '', { expires: new Date() });
        res.redirect('/');
        console.log(err);
      } else if (!admin || admin.token != token) {
        res.cookie('name', '', { expires: new Date() });
        res.cookie('token', '', { expires: new Date() });
        res.redirect('/admin/Login');
      } else {
        req.body.name = name;
        next();
      }
    });
  }
  else next();
};
app.use(adminAuth);
app.use('/admin', adminPages);
app.use('/admin', admin);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

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
