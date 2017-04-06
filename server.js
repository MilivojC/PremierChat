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
    // Ajout pour récupération de POST
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var AuthMili = require('./AuthMili'); // Fait appel à AuthMili.js

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
// Chargement dossier statique présentation etc.
app.use(express.static(__dirname + '/public'));

var sess; // variable de session utilisee par socket

        //Ouverture de l'écoute io.sockets
io.sockets.on('connection', function (socket, pseudo) {
    
// ECOUTE CONCERNANT LE CHAT

// ---- CONNEXION AU CHAT DUN NOUVEAU CLIENT
    socket.on('ouvertureChat', function() {
 

        var nomUtilisateur = sess.user;
//        pseudo = ent.encode(pseudo);
       socket.pseudo = nomUtilisateur;
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
          
    });

// ---- NOUVEAU MESSAGE    
    socket.on('message', function (message, date) {
        // Dès qu'on reçoit un message, on récupère le pseudo de son auteur et on le transmet aux autres personnes
        message = ent.encode(message);
        socket.broadcast.emit('message', {pseudo: socket.pseudo, message: message, date: date});
        //Code pour l'enregistrement des messages dans la base de donnée
	   var pg1 = require('pg');
	   var conString = "postgres://postgres@localhost:5432/db_work";
        var client = new pg1.Client(conString);
	   client.connect();
	   client.query("INSERT INTO messages(utilisateur, message, date) VALUES($1, $2, $3)",[ socket.pseudo, message, date]);
    }); 

    
// ECOUTE CONCERNANT LA CONNEXION SECURISEE
    
// ---- Après que le client est envoye ses identifiant il va demander si tout s'est bien deroule io va alors lui repondre
    socket.on('verification', function(){
        
        if (sess.AuthMi !== 1){
            
            socket.emit('refus');
        }
        
    });
    

    /*
    // ---- LOGIN DE L'UTILISATEUR  
    socket.on('connexion', function (Username, Password) {
        // On recoit ce qu'envoi le formulaire de login    
        var User = Username; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        var pwd = Password; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        console.log(User + " est connecté avec le password : " +pwd);
//        socket.emit('UPDATE', 1);
        
*/       


}); 


app.get('/home', function (req, res) {    
 console.log(req.session);
    sess = req.session

    if (req.session.user === "Milivoy"){
        console.log("Authentification reussie dans authe");
        
        
        res.sendFile(__dirname + '/public/home.html');
        
    }
    else {
        console.log("Authentification rate dans authe");
        res.redirect('/login');
        res.end()
    }
});

app.post('/home', upload.array(), function (req, res) { 
    
   var pg2 = require('pg'),
        conString2 = "postgres://postgres@localhost:5432/db_work",
       client2 = new pg2.Client(conString2);
       client2.connect();
    var query2 = client2.query("DELETE * FROM session WHERE sid =" + req.session.id);

    console.log(req.session);
});   

//Renvoie toutes les demandes '/' sur '/home' -> permet de shinté les problèmes avec index.html
app.all('/',function(req,res){res.redirect('/home');});

// Chargement de la page login.html | Vérification de l'existence de la session et redirection si necessaire.
app.get('/login', function (req, res) {  

    if (req.session.AuthMi === 1) { //si la variable d'autorisation est déja a 1 alors redirection
        res.redirect('/');        
  }
    else { //sinon on envoi le formulaire
      res.sendFile(__dirname + '/public/login.html');
  }
});

//Reception de la requete d'identification
app.post('/login', upload.array(), function(req, res) {
	
    //Requete qui va chercher dans la db si le mdp et l'id correspondent
    var pg1 = require('pg'),
        conString1 = "postgres://postgres@localhost:5432/db_work",
        client1 = new pg.Client(conString1);
        client1.connect();
    var query1 = client1.query("SELECT * FROM identification WHERE nigol ='" + req.body.Username +"'");
    query1.on('row', function(row) {   
        if (row.drowssap == req.body.password && row.nigol == req.body.Username){ // Si cela correspond on affecte les valeurs à la variable de session et on renvoi sur home (notement authMi qui donne acces aux pages)
            req.session.AuthMi = 1;
            req.session.user = req.body.Username;
            res.redirect('/home');
        }
        
   //     else --> Sinon on affiche une erreur d'authentification avec le websocket
        sess = req.session; //Pour cela on affecte la session a la variable sess qui sera utilisé par le websocket.    
        

	});  


});



server.listen(8080, "127.0.0.1");
