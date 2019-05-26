var request = require('request');
imageList = [];
var stat = {
    err1:[],
    err3:[]
};
stat.run = false;
var s = {
    su:0,
    err1:0,
    err2:0,
    err3:0
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
        
            stat.text = `Loging to ${insx[i]}`;
            var client = await login(insx[i], "Samer@88");
            stat.text = `Logined to ${insx[i]}`;
            if (client === 'err1') {
                console.log(`Error Code 1 ${++s.err1}`);
                continue;
            }
            if (client == 'err2') {
                console.log(`Error Code 2 ${++s.err2}`);
                continue;
            }
       
         var p =  await proc(client, imageList[i]);
        if (p === null) {
            console.log(`Error Code 3 ${++s.err3}`);
            stat.err3.push(insx[i]);
        }
        else { save(insx[i]);
               s.su++;
             }
        console.log('comple '+i); 
        
       await sleep(50);
}
    console.log('comple full');
    stat.text = 'comple';
    stat.url1 = './data/success.txt';
    stat.url2 = '/cookies';
    console.log(s);
}

function login(user, pass) {
    return new Promise(async resolve => {
        
            console.log('login ...');
         if (user.indexOf('@') > -1)
         user = user.match(/(.*?)@.*/)[1];
        var cookie = new FileCookieStore('.public//cookies/'+user+'.json');
        if (pass === undefined) 
            var client = new Instagram({});
        else
            var client = new Instagram({ username:user, password:pass, cookieStore:cookie });
        try {
            await client.login();
            var arrCookie = client.credentials.cookies;
            arrCookie.forEach((key, index) => {
                if (key.key == 'ds_user_id')
                    {
                        resolve(client);
                        return;
                    }
            });
            resolve('err2');
            //console.log('logined');
        }
        catch(e) {
            stat.err1.push(user);
            console.log("login fuiled");
            resolve('err1');
            //console.log(client);
        }
        
        
    });
}
//(async function() {
//   var a =await login("hucvu18", "Samer@88"); 
//    //await a.follow({userId : '2'});
//    console.log(a);
//})();



function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
    resolve();
    }, ms);
  });
}

function proc(usr, name) {
    return new Promise(async resolve => {
        var lst = [ '173560420',
                    '18428658',
                    '6860189',
                    '427553890',
                    '787132',
                    '7719696',
                    '232192182',
                    '6380930',
                    '305701719',
                    '13460080',
                    '29394004',
                    '1436859892' ];
        var n =1;
        try {
            var photo = name;
            await usr.changeProfilePhoto({ photo });
            stat.text = 'updated image';
            for (var l=0; l<lst.length; l++)
                {
                    usr.follow({ userId: lst[l] })
                    .then(function() {
                        n++;
                        stat.text = 'follow '+n;
                        if (n == (lst.length))
                            resolve(true);
                    });
                }
        }
        catch(e) {
            resolve(null);
            //console.log(e);
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
        var download = function(uri, filename, fn){
                 request.head(uri, function(err, res, body){
                    if (err) {
                        console.log(err);
                        fn();
                        return; 
                    }
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);
    if (res.headers['content-length'] === undefined)
        {
            fn();
            return;
        }
        imageList.push(filename);
                 
    request(uri).pipe(fs.createWriteStream(filename)).on('close', fn);
  });
           
};
        
        console.log('downloading Images ...');
        var n = 1;
        for (var ii=0; ii<list.length; ii++)
            {
            console.log(ii);
            download(list[ii].url, './photos/ph_'+ii+'.jpg', () => {
                stat.text = n.toString();
                n++;
                console.log('ccc');
                if (n == list.length) {
                    console.log('dowloand comple');
                    stat.text = 'Download Comple';
                    resolve();
                }
            });
            }

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

//async function getIdByUserName() {
//    var client = await login('fcpwu_15', 'Samer@88');
//    var users = fs.readFileSync('./users.txt', 'utf8').split('\r\n');
//    var txt = '';
//    for (var i=0; i<users.length; i++)
//        {
//            console.log( users[i]);
//            //console.log(users[i] + ' : ' +'cristiano');
//            var usr = await client.getUserByUsername({ username: users[i] });
//            console.log(usr.id);
//            if (txt != '') txt += '\n';
//            txt += usr.id;
//        }
//    fs.writeFileSync('./usrr.txt', txt);
//    console.log('saved !');
//    
//}
//getIdByUserName();

module.exports = {main:main, getStat:getStat};