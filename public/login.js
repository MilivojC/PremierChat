var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {

    
<<<<<<< HEAD
    e.preventDefault(); // J'empêche le comportement par défaut du navigateur, c-à-d de soumettre le formulaire
    
=======
>>>>>>> b6c5e7a201f6c4cc6feb4e0cb367c4ae8d49eaa3
    if ($.browser.safari)
        {
            this.action += '?t=' + new Date().getTime();
            this.submit();
        }
    else {
            this.submit();
         };
    
    
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    socket.emit('verification');    
    return false;
});




socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});
