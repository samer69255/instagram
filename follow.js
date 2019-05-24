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




function getStat() {
    
    console.log('status :' +stat);
    return JSON.stringify(stat);
}

module.exports = {main:main, getStat:getStat};