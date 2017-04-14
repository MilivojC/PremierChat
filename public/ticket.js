/*

// Connexion    socket.io
var socket = io.connect('http://milivoy.screeb.io');

// ESSAYER DE VOIR SI ON PEUT CONDITIONNER L4ACTION SOCKET COTE SERVEUR POUR QU4IL N4ENVOI QUE LORSQUE LA PAGE EST ACTIVE



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
        $('html,body').animate({scrollTop: $('#cale').offset().top}, 1);
    }
    
    catch(err) {
        console.log(err + " : " + nowtimeB);
    }
});

// Quand un nouveau client se connecte, on affiche l'information
socket.on('nouveau_client', function(pseudo) {
    $('#zone_chat').append('<p><em>' + pseudo + ' a rejoint le Chat !</em></p>');
    $('html,body').animate({scrollTop: $('#cale').offset().top}, 'slow');
});
*/
/*   

//sdlkfls
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

var socket = io.connect('http://milivoy.screeb.io');

socket.emit('ouvertureTicket');

// Le serveur nous repond et renvoi les identifiants qui nous permettent de parametrer la page
socket.on('acceptationTicket', function(nomUtilisateur){
   
    document.title = nomUtilisateur + ' - ' + document.title;
    document.getElementById("user").innerHTML = nomUtilisateur;
    
});

socket.on('params', function(data){
    
    $('#quel_magasin').append('<option value="' + data.magasinId + '" data-info="' + data.nbrPage + '">' + data.magasinName + '</option>');
       
    
});


socket.on('tickets', function(data) {
    console.log("scoket marche sur le client");
    insereTicket(data.noBon, data.date);

});


$(window).scroll(function(){
    
    
    //Animation du bouton logout
    var bouton1 = document.getElementById("logoutdiv");
    var bouton2 = document.getElementById("goTicket");

    if (document.body.scrollTop < 40){
        bouton1.style.top= 50 - document.body.scrollTop + 'px';
        bouton2.style.top= 100 - document.body.scrollTop + 'px';
    }
    else {
        bouton1.style.top = '10px';
        bouton2.style.top = '60px';
    };
    
    //Animation du bouton ticket
    
});

// Ajoute un ticket dans la page
function insereTicket(noBon, date) {
    console.log(noBon);
    $('#zone_ticket').append('<div class="ticket">' + date + ' : ' + noBon + '</div>');

};


$('#rechercheBon').submit(function () {
    var magasin = $('#quel_magasin').val(),
        no_bon =$('#nobonid').val();
    
    socket.emit('recherche_no', magasin , no_bon); // Transmet les informations pour récuperer le bon

    return false; // Permet de bloquer l'envoi "classique" du formulaire
});

