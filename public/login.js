var socket = io.connect('http://milivoy.screeb.io');

//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {
e.preventDefault();
    try {
        
        this.submit();
    }
    catch(e) {
        
        this.action += '?t=' + new Date().getTime();
            this.submit();
    }
    console.log("La fonction 1 est jouee");

});

$('#formulaire_login').submit(function () {
 
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    socket.emit('verification'); 
    console.log("La fonction 2 est jouee");
 return false;
});




socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});
