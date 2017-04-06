var socket = io.connect('http://milivoy.screeb.io');


$('#formulaire_login').submit(function () {
    socket.emit('verification');
    return;
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    
});


socket.on('refus'){
    
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
};