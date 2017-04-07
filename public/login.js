var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {
    return;
});

$('#formulaire_login').submit(function () {


    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
  socket.emit('verification');
    return false;
});




socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});
