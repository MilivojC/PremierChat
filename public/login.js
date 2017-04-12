var socket = io.connect('http://milivoy.screeb.io');

function soumission() {
    document.getElementById("formulaire_login").submit();  
    //socket.emit('verification'); 
    console.log("La fonction soumission est jouee");
    //document.getElementById("#Username").reset().focus(); 
    //document.getElementById("#password").reset(); // Vide les zones de renseignement et remet le focus sur identifiant
    return aftersoum();
    
};

function aftersoum(){
    document.getElementById("Username").value="";
    document.getElementById("password").value="";
    socket.emit('verification');
    console.log("La fonction aftersoum est jouee");
};




/*
$('#formulaire_login').submit(function () {
    console.log("La fonction blocage est jouée");
return false;
});
*/
/*

$('#formulaire_login').submit(function () {
    document.getElementById("#formulaire_login").submit();
    $('#Username').val('').focus(); 
    $('#password').val(''); // Vide les zones de renseignement et remet le focus sur identifiant
    socket.emit('verification'); 
    console.log("La fonction 2 est jouee");
 return false;
});

*/
socket.on('refus', function(){
  $('#console').prepend('<p style="color:red;">Identifiant ou mot de passe incorrect!</p>');  
});
