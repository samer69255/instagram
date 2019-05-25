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

async function main(ff, ids) {
    stat.run = true;
    console.log('proccess run');
    stat.text = 'proccess run';
    var insx = fs.readFileSync(ff, 'UTF-8').trim().split('\n');
    ids = ids.trim().split('\n');
    console.log(ids);
    stat.color = 'spinner-grow text-primary';
    setTimeout(function() {
       delete stat.color;
    }, 5000);
    for (var i=0; i<insx.length; i++) {
        
            var client = await login(insx[i], "Samer@88");
            stat.text = insx[i];
            if (client === null) continue;
       
         var p =  await proc(client, ids);
        stat.text = i + '/' + insx.length;
        console.log('comple '+i); 
        
       await sleep(10);
}
    console.log('comple full');
    stat.s = s;
    stat.text = 'comple';
    stat.run = false;
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

function proc(usr, ids) {
    return new Promise(async resolve => {
        for (var o=0; o<ids.length; o++) {
            try {
                await usr.follow({ userId: ids[o] });
                s.su++;
        }
            catch(e) {
            console.log(e);
            s.err++;
        }
         
        }
        resolve();
        
    });
}




function getStat() {
    
    console.log('status :' +stat);
    return JSON.stringify(stat);
}

module.exports = {main:main, getStat:getStat};