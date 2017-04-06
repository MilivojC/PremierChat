var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function (event) {
    
    event.preventDefault();
    var $form = $( this ),
    url = $form.attr( "http://milivoy.screeb.io/login" );
    var posting = $.post( url, { Username : $('#Username').value, password:$('#password').value } );
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    socket.emit('verification');   
});


socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});

