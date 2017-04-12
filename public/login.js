var socket = io.connect('http://milivoy.screeb.io');

function soumission() {

   for (x = 0; x < 2; x++) { 
        switch (x){
            case 0:
                soum();
                x=x+1;
                break;
            case 1:
                aftersoum();
                break;
                x=x+1;
                 };
        
    }
    
};

function aftersoum(){
    document.getElementById("Username").value="";
    document.getElementById("password").value="";
    socket.emit('verification');
    console.log("La fonction aftersoum est jouee");
};

function soum() {
    
    document.getElementById("formulaire_login").submit(); 
    console.log("La fonction soumission est jouee");
    
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
