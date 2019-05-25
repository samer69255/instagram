$('#f1').submit(function(e) {
    e.preventDefault();
    
    $('#main').hide();
    $('#stat').show();
    
    //var data = $(this).serialize();
    (function() {
    var file = document.getElementById('l').files[0]; //Files[0] = 1st file
    var reader = new FileReader();
    reader.readAsText(file, 'UTF-8');
    reader.onload = shipOff;
    function shipOff(event) {
    var result = event.target.result;
    var fileName = document.getElementById('l').files[0].name; //Should be 'picture.jpg'
    $.post('', { data: result, name: fileName, ids: $('#ids').val() }, function(data, err, xhr) {
        console.log(data);
        if (data == 'filetype') {
            $('#main').show();
            $('#stat').hide();
            alert('الرجاء اختيار ملف نصي');
            return;
        }
        start();
    });
}
})();
  
    
   
});

(function() {
     $.get('stat', function(data, err, xhr) {
        // if (err) console.log(err);
        data = JSON.parse(data);
         console.log(data);
        if (data.run === true) {
            $('#main').hide();
            $('#stat').show();
            start();
        }
    })
})();

function start() {
     inv = setInterval(function() {
    $.get('stat', function(data, err, xhr) {
        data = JSON.parse(data);
        if (data.text == 'comple') 
            {
                clearInterval(inv);
                $('#text').html('success: '+data.s.su+'<br>fuil: '+data.s.err);
                return;
            }
        if (data.color !== undefined ) $("div.spinner-grow").attr('class', data.color);
        $('#text').text(data.text);
    })
}, 1000);
}