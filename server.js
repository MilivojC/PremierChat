// Fichier serveur pour milivoy.screeb.io
var express = require('express'), 
    app = require('express')(),
    server = require('http').createServer(app), //Creation serveur
    io = require('socket.io').listen(server), // Ecouteur client/serveur
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs'),// Construction html

    pg = require('pg'),// Gestion session/cookie
    session = require('express-session'),// Gestion session/cookie
    bodyParser = require('body-parser'),
    pgSession = require('connect-pg-simple')(session);// Gestion session/cookie
app.use(express.static(__dirname + '/public')); //Chargement dossier des fichiers statiques
// Suivi de session
app.use(session({
      store: new pgSession({
        pg : pg,                                  // Use global pg-module 
        conString : "postgres://postgres@localhost:5432/db_work", // Connect using something else than default DATABASE_URL env variable 
        tableName : 'session'               // Use another table-name than the default "session" one 
      }),
      secret: "ScribeSecret",
      resave: false,
      saveUninitialized: true,
      cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 day
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

var sess; // variable de session




// Chargement de la page login.html | Login endpoint
app.get('/login', function (req, res) {  

    if (req.session.user === "Milivoy") {
      console.log("Il considere que lauthentification est reussi et nous envoi sur / ");
        res.redirect('/');
        
  }
  else {
      
      console.log("Il se rend compte que c'est un echec");
      res.sendFile(__dirname + '/public/login.html');
  }
       
}).post('/login', function(req, res) {
	req.session.user = req.body.Username;
	req.session.pass = req.body.password;
	sess = req.session;
    if (req.session.user == "Milivoy" ){
        return res.redirect('/');
    }

});

app.get('/', function (req, res) {    
    if (req.session.user === "Milivoy"){
        console.log("Authentification reussie dans authe");
        res.sendFile(__dirname + '/public/index.html');
                        
    }
    else {
        console.log("Authentification rate dans authe");
        res.redirect('/login');
    }
});



/*
// Authentication and Authorization Middleware
var authe = {
    cont : function(req, res, next) {
    if (req.session.user === "Milivoy"){
        console.log("Authentification reussie dans authe");
        next();
    }
    else {
        console.log("Authentification rate dans authe");
        res.redirect('/login');
    }
},
    dej : function(req, res, next) {
 
    console.log("le middleware dejauth est actif");
    
    if (req.session.user === "Milivoy") {
      console.log("Il considere que lauthentification est reussi et nous envoi sur / ");
        res.redirect('/');
        
  }
  else {
      
      console.log("Il se rend compte que c'est un echec");
      next();
  }
}
};

  */  

/*

        //Ouverture de l'écoute io.sockets
io.sockets.on('connection', function (socket, pseudo, session) {
    
// ECOUTE CONCERNANT LE CHAT

// ---- CONNEXION AU CHAT DUN NOUVEAU CLIENT
    socket.on('ouvertureChat', function() {
 
  
    if (req.session && req.session.user === "Milivoy"){
        console.log("Authentification reussie");
        
        var nomUtilisateur = req.session.user;
//        pseudo = ent.encode(pseudo);
//       socket.pseudo = pseudo;
        socket.emit('acceptationChat', nomUtilisateur)
        socket.broadcast.emit('nouveau_client', nomUtilisateur);
	   //Code pour la recuperation des messages dans la base de donnée
        var pg = require('pg');
        var conString = "postgres://postgres@localhost:5432/db_work";
	   var client2 = new pg.Client(conString);
	   client2.connect();
	   var query = client2.query("SELECT * FROM messages");
	
	query.on('row', function(row) {
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
          
    }
    else {
    console.log("Echec Authentification")
        socket.emit('acceptationChat', req.session.user)
    }

    });

// ---- NOUVEAU MESSAGE    
    socket.on('message', function (message, date) {
        // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message, date: date});
        //Code pour l'enregistrement des messages dans la base de donnée
	   var pg = require('pg');
	   var conString = "postgres://postgres@localhost:5432/db_work";
        var client = new pg.Client(conString);
	   client.connect();
	   client.query("INSERT INTO messages(utilisateur, message, date) VALUES($1, $2, $3)",[ socket.pseudo, message, date]);
    }); 

    
// ECOUTE CONCERNANT LA CONNEXION SECURISEE
    

    /*
    // ---- LOGIN DE L'UTILISATEUR  
    socket.on('connexion', function (Username, Password) {
        // On recoit ce qu'envoi le formulaire de login    
        var User = Username; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        var pwd = Password; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        console.log(User + " est connecté avec le password : " +pwd);
//        socket.emit('UPDATE', 1);
        
//       


});    
        
        
*/

server.listen(8080, "127.0.0.1");
