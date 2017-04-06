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

app.use(express.static(__dirname + '/public'));


var sess; // variable de session

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











app.all('/',function(req,res){res.redirect('/home');});

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
       
    
    

    
    
});

app.post('/login', upload.array(), function(req, res) {
	sess = req.session;
    

      var pg1 = require('pg'),
        conString1 = "postgres://postgres@localhost:5432/db_work",
        client1 = new pg.Client(conString);
        client1.connect();
    var query1 = client1.query("SELECT * FROM identification WHERE nigol ='" + nom +"'");

    query.on('row', function(row) {
		
        console.log(row.drowssap == req.body.password);
        console.log(row.nigol == req.body.Username);
        
        if (row.drowssap == req.body.password && row.nigol == req.body.Username){
            console.log("Confirmation du doublet");
            req.session.AuthMi = 1;
  
        }

	});  
    
     
    
    if (req.session.AuthMi === 1 ){
        return res.redirect('/home');
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


   
        
        


server.listen(8080, "127.0.0.1");
