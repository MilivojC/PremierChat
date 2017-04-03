// Fichier serveur pour milivoy.screeb.io
var express = require('express'), 
    app = require('express')(),
    router = express.Router();
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');

app.use(express.static(__dirname + '/public')); //Chargement dossier des fichiers statiques

// Chargement de la page login.html
app.get('/login', function (req, res) {
  res.sendFile(__dirname + '/public/login.html');
});

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendFile(__dirname + '/public/index.html');
});

//Ouverture de l'écoute io.sockets
io.sockets.on('connection', function (socket, pseudo) {
    

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

    
// On recoit ce qu'envoi le formulaire de login    
    socket.on('connexion', function (Username, Password) {
        var User = Username; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        var pwd = Password; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        console.log(User + " est connecté avec le password : " +pwd);
        if (User == "Milivoy") {
            reponse=1;    
        } 
        
        else {
            reponse=0; 
        };
        
        //On envoi la réponse au client pour qu'il sache si cela s'est passe correctement
        socket.emit('successAuth', {Auth : reponse});        
    });    
    
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




server.listen(8080, "127.0.0.1");
