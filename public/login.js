var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {

    console.log("socketemit a du etre joue");
    return;
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
        socket.emit('verification');
    
});


socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});
