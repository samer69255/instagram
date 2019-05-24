var request = require('request');
imageList = [];
var stat = {};
stat.run = false;
var s = {
    su:0,
    err:0
}

var fs = require('fs');
const Instagram = require('instagram-web-api');
const FileCookieStore = require('tough-cookie-filestore2');

async function main(ff) {
    stat.run = true;
    stat.text = 'Downloading Images ...';
   await downloadP();
    console.log('proccess run');
    stat.text = 'proccess run';
    var insx = fs.readFileSync(ff, 'UTF-8').split('\n');
    stat.color = 'spinner-grow text-primary';
    setTimeout(function() {
       delete stat.color;
    }, 5000);
    for (var i=0; i<insx.length; i++) {
        
            var client = await login(insx[i], "Samer@88");
            stat.text = insx[i];
            if (client === null) continue;
       
         var p =  await proc(client, imageList[i]);
        if (p === null) {
        console.log('error '+(++s.err));
        }
        else {save(insx[i]);
              s.su++;
             }
        console.log('comple '+i); 
        
       await sleep(10);
}
    console.log('comple full');
    stat.text = 'comple';
    stat.url = './data/success.txt';
    console.log(s);
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
            
            download(list[ii].url, './photos/ph_'+ii+'.jpg')
            .then
            console.log(ii);
            stat.text = ii.toString();
            console.log('ccc');
            }
        console.log('dowloand comple');
        stat.text = 'Download Comple';
        resolve();

     });
}

function search(text) {
    return new Promise(resolve => {
        var gis = require('g-i-s');
        var opts = {
            searchTerm: text,
            queryStringAddition: '&tbs=ift:jpg,itp:photo&start=200'
};
        gis(opts, (err, res) => {
            if (err) throw err;
            console.log(res.length);
            resolve(res);
        });
    });
}

function save(email) {
    fs.readFile('./public/data/success.txt', 'utf8', function(err, data) {
                if (err) throw err;
                if (data != '') data += '\n';
                data += email;
                fs.writeFileSync('./public/data/success.txt', data);
            });
}

function getStat() {
    
    console.log('status :' +stat);
    return JSON.stringify(stat);
}

module.exports = {main:main, getStat:getStat};