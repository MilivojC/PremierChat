var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {

    

    $.post("http://milivoy.screeb.io/login",
    {
        Username: $('#Username'),
        password: $('#password')
    });

    
    
    
    
 //   socket.emit('verification');  
//    $('#Username').val('').focus(); 
//    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    return false;
});

socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});

