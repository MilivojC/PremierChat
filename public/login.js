// Connexion    socket.io
var socket = io.connect('http://milivoy.screeb.io');
/*
// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('nouveau_client', pseudo);


// Quand on re  oit un message, on l'ins  re dans la page
socket.on('message', function (data) {

    try {
        var nowtimeA = data.date.split("T");
        var nowtimeB = nowtimeA[1].split(":");
        var heure = Number(nowtimeB[0]) + 2;
        var nowtime = nowtimeA[0] + " || " + heure + ":" + nowtimeB[1];
        insereMessage(data.pseudo, data.message, nowtime);
    }
    
    catch(err) {
        console.log(err + " : " + nowtimeB);
    }
})

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(pseudo) {
    $('#zone_chat').prepend('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
})
*/
// Lorsqu'on envoie le formulaire, on transmet l'identifiant et le mot de passe
$('#formulaire_login').submit(function () {
    var Username = $('#Username').val(),
        Password = $('#password').val();
    
    socket.emit('connexion', Username, Password); // Transmet les identifiants au serveurs

   
    $('#Username').val('').focus(); 
    $('#password').val('') // Vide les zones de renseignement et remet le focus sur identifiant
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

/*
// Ajoute un message dans la page
function insereMessage(pseudo, message, date) {
    $('#zone_chat').prepend('<div class="msg"><div class="msgvrai"><div class="entete"><div class="msguser">' + pseudo + '</div><div class="msgdate">' + date +  '</div></div>' + message + '</div></div>');
}
// Fonction trasformation 00
function format00(x){
	switch(x) {
        case 0:
        case 1:
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        case 7:
        case 8:
        case 9:
            return '0'+x
        break;

        default:
            return x
    }
};
*/