var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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

const fs = require("fs");
const Instagram = require('instagram-web-api');
async function login() {
    var client = new Instagram({ username:'eyjnp5', password:'Samer@88' });
    await client.login()
    var user = await client.getUserByUsername({ username: 'samawisamer' });
    console.log(user.id);
    var insx = fs.readFileSync('./insx2.txt', 'UTF-8').split('\n');
    var t1 = new Date().getTime();
    for (var i=0; i<insx.length; i++) {
        await follow(insx[i], 'Samer@88', user.id);
        console.log('followed '+i);
    }
    var t2 = new Date().getTime();
    var t = t2 - t1;
    console.log('comple time '+(t/1000) + 'sec');
}

function follow(user, pass, id) {
   return new Promise(async resolve => {
       var client = new Instagram({ username:user, password:pass });
    await client.login();
    await client.follow({ userId: id });
       resolve();
   });
    
}

login();

module.exports = app;
