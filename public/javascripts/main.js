//$('#main').hide();
//$('#stat').show();
$('#f1').submit(function(e) {
    e.preventDefault();
    
    $('#main').hide();
    $('#stat').show();
    log('Working ...');
    
    //var data = $(this).serialize();
    (function() {
    var file = document.getElementById('l').files[0]; //Files[0] = 1st file
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = shipOff;
    function shipOff(event) {
    var result = event.target.result;
    var fileName = document.getElementById('l').files[0].name; //Should be 'picture.jpg'
    $.post('/', { data: result, name: fileName }, function(data, err, xhr) {
        console.log(data);
        if (data == 'filetype') {
            $('#main').show();
            $('#stat').hide();
            alert('الرجاء اختيار ملف نصي');
            return;
        }
        //start();
    });
}
})();
  
    
   
});

(function() {
     $.get('/stat', function(data, err, xhr) {
        // if (err) console.log(err);
        data = JSON.parse(data);
         console.log(data);
        if (data.run === true) {
            $('#main').hide();
            $('#stat').show();
            //start();
        }
    })
})();

function start() {
     inv = setInterval(function() {
        $.get('/stat', function(data, err, xhr) {
            data = JSON.parse(data);
            if (data.url2 !== undefined) 
                {
                    clearInterval(inv);
                    var html = '<a href='+data.url1+'>success'+'</a>';
                    html += '<br><a href='+data.url2+'>Cookies'+'</a>';
                    $('#text').html(html);
                    if (data.err1) alert(data.err1.join('\n'));
                    if (data.err2) alert(data.err2.join('\n'));
                
                    return;
                }
            if(data.color !== undefined ) {
                if ( $("div.spinner-grow").attr("class") != data.color )
                $("div.spinner-grow").attr('class', data.color);
        }
        log(data.text);
    });
}, 100);
}

var lastLog = '';
function log(txt) {
    if (txt != lastLog) {
        lastLog = txt;
        $('#text')[0].value += txt + '\n';
    }
}