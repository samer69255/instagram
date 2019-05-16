var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var request = require('request');

var app = express();
var imageList = [];

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const FileCookieStore = require('tough-cookie-filestore2');
const fs = require("fs");
const Instagram = require('instagram-web-api');

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

async function main() {
    
   await downloadP();
    console.log('proccess run');
    var client = await login('eyjnp2', "Samer@88");
    var insx = fs.readFileSync('./insx.txt', 'UTF-8').split('\n');
    for (var i=0; i<insx.length; i++) {
        
            var client = await login(insx[i], "Samer@88");
            if (client === null) continue;
       
         var p =  await proc(client, imageList[i]);
        if (p === null) {
            fs.readFile('./block.txt', 'utf8', function(err, data) {
                if (err) throw err;
                if (data != '') data += '\n';
                data += insx[i];
                fs.writeFile('./block.txt', data);
            });
        console.log('error 1');
        }
        console.log('comple '+i); 
        
       await sleep(10);
    }
    console.log('comple full');
}

function login(user, pass) {
    return new Promise(async resolve => {
        
            console.log('login ...');
         if (user.indexOf('@') > -1)
         user = user.match(/(.*?)@.*/)[1];
        var cookie = new FileCookieStore('./cookies/'+user+'.json');
        if (pass === undefined) 
            var client = new Instagram({});
        else
            var client = new Instagram({ username:user, password:pass, cookieStore:cookie });
        try {
            await client.login();
            resolve(client);
            console.log('logined');
        }
        catch(e) {
            resolve(null);
            console.log("login fuiled");
        }
        
        
    });
}

function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
    resolve();
    }, ms);
  });
}

function proc(usr, name) {
    return new Promise(async resolve => {
        try {
            var photo = name;
            await usr.changeProfilePhoto({ photo });
            resolve(true);
        }
        catch(e) {
            resolve(null);
            console.log(e);
        }
        
    });
}

function downloadP() {
    return new Promise(async resolve => {
            var list1 = await search('صور انيقة');
            var list2 = await search('صور انستغرام');
            var list3 = await search('صور شخصية راقية');
            var list = list1.concat(list2).concat(list3);
            delete list1,list2,list3;
        var download = function(uri, filename){
            return new Promise(resolvee => {
                 request.head(uri, function(err, res, body){
                    if (err) {
                        console.log(err);
                    resolvee();
                    return; 
                    }
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    if (res.headers['content-length'] === undefined)
        {
            resolvee();
            return;
        }
        
        imageList.push(filename);
                 

    request(uri).pipe(fs.createWriteStream(filename)).on('close', resolvee);
  });
            });
};
        
        console.log('downloading Images ...');
        for (var ii=0; ii<list.length; ii++)
            {
            
            console.log(ii);
            await download(list[ii].url, './photos/ph_'+ii+'.jpg');
            console.log('ccc');
            }
        console.log('dowloand comple');
        resolve();

     });
}

function search(text) {
    return new Promise(resolve => {
        var gis = require('g-i-s');
        gis(text, (err, res) => {
            if (err) throw err;
            console.log(res.length);
            resolve(res);
        });
    });
}

main();

module.exports = app;
