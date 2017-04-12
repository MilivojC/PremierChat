var socket = io.connect('http://milivoy.screeb.io');

function soumission() {
console.log(navigator.appName)
   for (i = 0; i < 2; i++) { 
        switch (i){
            case 0:
                soum();
                break;
            case 1:
                aftersoum();
                break;
                
                 };
        
    }    
};

function aftersoum(){
    socket.emit('verification');
    console.log("La fonction aftersoum est jouee");
};

function soum() {

    document.getElementById("formulaire_login").submit(); 
    console.log("La fonction soumission est jouee");
    
};





$('#formulaire_login').submit(function () {
    console.log("La fonction blocage est jouée");
return false;
});

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
    document.getElementById("Username").value="";
    document.getElementById("password").value="";

});
