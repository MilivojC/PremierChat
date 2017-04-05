// Connexion    socket.io
var socket = io.connect('http://milivoy.screeb.io');


//$('#formulaire_login').submit(function () {
//    var Username = $('#Username').val(),
//        Password = $('#password').val();
    
//    socket.emit('connexion', Username, Password); // Transmet les identifiants au serveurs

//    $('#Username').val('').focus(); 
//    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
//    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

//Le client attend que le serveur lui dise qu'il est bien authentifie. Si il lest le client part dans la homepage sinon un message d'erreur apparait.
socket.on('successAuth', function(Auth) {
    if (Auth === 1) {
        document.location.href = 'http://milivoy.screeb.io'; 
    } else {
     $('#console').prepend('<p style="color:red;"> Lauthentification a échoué</p>');
    };
});

socket.on('UPDATE', function(ok){
          document.location.href = 'http://milivoy.screeb.io/login';
   
          });
