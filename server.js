// Fichier serveur pour milivoy.screeb.io

var express = require('express'), 
    app = require('express')(),
    var router = express.Router();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');

app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/login.html');
});
//Chargement dossier des fichiers statiques
app.use(express.static(__dirname + '/public'));



// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});



io.sockets.on('connection', function (socket, pseudo) {
    
  /* 
      socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
//MILI	//puis CHARGEMENT DES ANCIENS MESSAGES

	//Code pour la recuperation des messages dans la base de donnée
        var pg = require('pg');
        var conString = "postgres://postgres@localhost:5432/db_work";
	var client2 = new pg.Client(conString);
	client2.connect();
	var query = client2.query("SELECT * FROM messages");
	
	query.on('row', function(row) {
// LIGNE QUI NA PAS MARCHE	var ligne = JSON.parse(row);
//	    console.log(row.message);
		try{
			socket.emit('message', {pseudo: row.utilisateur, message: row.message, date: row.date});
		}
		catch(err){
			console.log("Problème sur le broadcast");
		}


	});
	
	query.on('end', function() {
	    client2.end();
	});




//MILI	//FIN DE L'AJOUT


    });
*/
    
    /*
    // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
    socket.on('message', function (message, date) {
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message, date: date});

//MILI	// CONNECTION DATABASE DB_WORK
	//Code pour l'enregistrement des messages dans la base de donnée
	var pg = require('pg');
	var conString = "postgres://postgres@localhost:5432/db_work";

	var client = new pg.Client(conString);
	client.connect();
	client.query("INSERT INTO messages(utilisateur, message, date) VALUES($1, $2, $3)",[ socket.pseudo, message, date]);
//	console.log("Message correctement ajouté à la base de donnée");

//MILI	FIN DE L'AJOUT

    }); 
*/
    
    
    socket.on('connexion', function (Username, Password) {
        User = ent.encode(Username);
        pwd = ent.encode(Password);
        console.log(Username + " est connecté avec le password : " +Password);
            router.get('/', function(req, res) {
                res.sendFile(__dirname + '/public/index.html');
            });
    });    
        /*
//MILI	// CONNECTION DATABASE DB_WORK
	//Code pour l'enregistrement des messages dans la base de donnée
	var pg = require('pg');
	var conString = "postgres://postgres@localhost:5432/db_work";

	var client = new pg.Client(conString);
	client.connect();
	client.query("INSERT INTO messages(utilisateur, message, date) VALUES($1, $2, $3)",[ socket.pseudo, message, date]);
//	console.log("Message correctement ajouté à la base de donnée");

//MILI	FIN DE L'AJOUT
*/
     


});




server.listen(8080, "127.0.0.1");
