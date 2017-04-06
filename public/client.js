// Connexion    socket.io
var socket = io.connect('http://milivoy.screeb.io');
/*
// On demande le pseudo, on l'envoie au serveur et on l'affiche dans le titre
var pseudo = prompt('Quel est votre pseudo ?');
socket.emit('nouveau_client', pseudo);
document.title = pseudo + ' - ' + document.title;
document.getElementById("user").innerHTML = pseudo;
*/

//On previent au socket quon rentre sur le chat
socket.emit('ouvertureChat');
// Le serveur nous repond et renvoi les identifiants qui nous permettent de parametrer la page
socket.on('acceptationChat', function(nomUtilisateur){
   
    document.title = nomUtilisateur + ' - ' + document.title;
    document.getElementById("user").innerHTML = nomUtilisateur;    
});





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
});

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(pseudo) {
    $('#zone_chat').prepend('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
});

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaire_chat').submit(function () {
    var message = $('#message').val();
    var nowtimeB = new Date();
    var jour = nowtimeB.getDate();
    var mois = nowtimeB.getMonth()+1;
    var annee = 2000+nowtimeB.getYear()-100;
    var heure = nowtimeB.getHours();
    var minutet = nowtimeB.getMinutes();
    var nowtime = annee + "-" + format00(mois) + "-" + format00(jour) + " || " + format00(heure) + ":" + format00(minutet);


    socket.emit('message', message, nowtimeB); // Transmet le message aux autres

    insereMessage(document.getElementById("user").innerHTML, message, nowtime); // Affiche le message aussi sur notre page
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

// Lorsqu'on envoie le formulaire, on transmet le message et on l'affiche sur la page
$('#formulaireDeconnexion').submit(function () {

    socket.emit('message', message, nowtimeB); // Transmet le message aux autres

    insereMessage(document.getElementById("user").innerHTML, message, nowtime); // Affiche le message aussi sur notre page
    $('#message').val('').focus(); // Vide la zone de Chat et remet le focus dessus
    return false; // Permet de bloquer l'envoi "classique" du formulaire
});


   
// Ajoute un message dans la page
function insereMessage(pseudo, message, date) {
    $('#zone_chat').prepend('<div class="msg"><div class="msgvrai"><div class="entete"><div class="msguser">' + pseudo + '</div><div class="msgdate">' + date +  '</div></div>' + message + '</div></div>');
};
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
