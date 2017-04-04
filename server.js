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

var sess;


/*
// Authentication and Authorization Middleware
var authe = function(req, res, next) {
  if (req.session && req.session.user === "amy" && req.session.admin)
    return next();
  else
    return res.sendStatus(401);
};
*/


// Chargement de la page login.html | Login endpoint
app.get('/login', function (req, res) {  
    sess = req.session;
	if(sess.nom) {
/*
* This line check Session existence.
* If it existed will do some action.
*/
    res.sendFile(__dirname + '/public/index.html'); 
		console.log(sess.nom);
}
else {
	res.sendFile(__dirname + '/public/login.html');
}
	 
    
  });
});

// Chargement de la page index.html
app.get('/', function (req, res) {
	sess = req.session;
	if(sess.nom) {

		/*
* This line check Session existence.
* If it existed will do some action.
*/
 res.sendFile(__dirname + '/public/index.html');   
		console.log(sess.nom);
}
else {
	res.sendFile(__dirname + '/public/login.html');
}
});

//Ouverture de l'écoute io.sockets
io.sockets.on('connection', function (socket, pseudo, session) {
    

    
    
// ECOUTE CONCERNANT LE CHAT

// ---- CONNEXION AU CHAT DUN NOUVEAU CLIENT
    socket.on('nouveau_client', function(pseudo) {
        pseudo = ent.encode(pseudo);
        socket.pseudo = pseudo;
        socket.broadcast.emit('nouveau_client', pseudo);
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
	   var pg = require('pg');
	   var conString = "postgres://postgres@localhost:5432/db_work";
        var client = new pg.Client(conString);
	   client.connect();
	   client.query("INSERT INTO messages(utilisateur, message, date) VALUES($1, $2, $3)",[ socket.pseudo, message, date]);
    }); 

    
// ECOUTE CONCERNANT LA CONNEXION SECURISEE
    
// ---- LOGIN DE L'UTILISATEUR  
    socket.on('connexion', function (Username, Password) {
        // On recoit ce qu'envoi le formulaire de login    
        var User = Username; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        var pwd = Password; // ce sera interessant de mettre un ent. pour la securite a lavenir.
        console.log(User + " est connecté avec le password : " +pwd);
	    sess.nom Username;
/*          if (User == "Milivoy") {
            var reponse = 1;    
            console.log("La reponse " + reponse);
       } 

        else {
            var reponse = 0; 
           console.log("La reponse " + reponse);
        };

        //On envoi la réponse au client pour qu'il sache si cela s'est passe correctement
        socket.emit('successAuth', reponse);   */             
  /*      if ( User != "Milivoy" || pwd != "haha") {
            socket.emit('successAuth', 0);
               
        } else if(User == "Milivoy" || pwd == "haha") {
          //  app.session.user
        //    req.session.user = "amy";
        //    req.session.admin = true;
          //  res.send("login success!");
            socket.emit('successAuth', 1);
        }
*/
    });
    
});

server.listen(8080, "127.0.0.1");
