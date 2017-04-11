var socket = io.connect('http://milivoy.screeb.io');

function soumission() {
    document.getElementById("#formulaire_login").submit();  
    //socket.emit('verification'); 
    console.log("La fonction soumission est jouee");
    //document.getElementById("#Username").reset().focus(); 
    //document.getElementById("#password").reset(); // Vide les zones de renseignement et remet le focus sur identifiant
    
};




/*
//socket.emit('jesuisla');
$('#formulaire_login').submit(function () {


        this.action += '?t=' + new Date().getTime();
        this.submit();
    
    console.log("La fonction 1 est jouee");
return false;
});
*/
$('#formulaire_login').submit(function () {
    soumission();
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    socket.emit('verification'); 
    console.log("La fonction 2 est jouee");
 return false;
});


socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});
