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


app.get('/home', function (req, res) {    
 console.log(req.session);
    sess = req.session

    if (req.session.AuthMi === 1){
        console.log("Authentification reussie dans authe");
        
        
        res.sendFile(__dirname + '/public/home.html');
        
    }
    else {
        console.log("Authentification rate dans authe");
        res.redirect('/login');
        res.end()
    }
});



// Chargement de la page login.html | Vérification de l'existence de la session et redirection si necessaire.
app.get('/login', function (req, res) {  
    sess = req.session;
    
    if (req.session.AuthMi === 1) { //si la variable d'autorisation est déja a 1 alors redirection
        res.redirect('/');        
  }
    else { //sinon on envoi le formulaire
      res.sendFile(__dirname + '/public/login.html');

  }
}).post('/login', upload.array(), function(req, res) {
console.log(req.body);
    //Requete qui va chercher dans la db si le mdp et l'id correspondent
    var pg1 = require('pg'),
        conString1 = "postgres://postgres@localhost:5432/db_work",
        client1 = new pg1.Client(conString1);
        client1.connect();
    var query1 = client1.query("SELECT * FROM identification WHERE nigol ='" + req.body.Username +"'");
    query1.on('row', function(row) {   
        if (row.drowssap == req.body.password && row.nigol == req.body.Username){ // Si cela correspond on affecte les valeurs à la variable de session et on renvoi sur home (notement authMi qui donne acces aux pages)
            console.log("identification acceptee dans le post");
            req.session.AuthMi = 1;
            req.session.user = req.body.Username;
            req.session.vendToken="";
            sess = req.session;
            res.redirect('/home');     
        }
        

	});
    
      query1.on('end', function() {
	       client1.end();

	   });


});

//Placer audessus du /ticket pour que req.session reste configure
app.get("/", upload.array(), function(req,res){
    //On récupère le code de validation client
    var code = req.query.code;
    //On construit la requete faite a vend pour obtenir le token
    var codeV =  code,
        client_idV = '7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc',
        client_secretV = 'ZA0qaHzmT4yMGtGmUyj0dIrYQwhaBpfy',
        redirect_uriV = 'http://milivoy.screeb.io';
        var request = require("request");
        var options = { 
                method: 'POST',
                url: 'https://lacliniqueduportable.vendhq.com/api/1.0/token',
                headers: 
                    { 
                        'cache-control': 'no-cache',
                        'content-type': 'application/x-www-form-urlencoded' 
                    },
                form: 
                    { 
                        code: codeV,
                        client_id: client_idV,
                        client_secret: client_secretV,
                        grant_type: 'authorization_code',
                        redirect_uri: redirect_uriV 
                    } 
        };
    var UseSession= "Montage de token"
    
    //On lance la requete et on affecte le token obtenu a la sesssion
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        //req.session.vendToken = "Bearer " + JSON.parse(body).access_token;
      });
    request.on('response', function(response){
        console.log(response.body);
        console.log("Dnas le request on au desus");
        
    });
    
    

    console.log(req.session);
    
    res.redirect('/home');    
});


app.get('/ticket', function (req, res) {    
 console.log(req.session);
    sess = req.session

    if (req.session.AuthMi === 1){
        console.log("Authentification reussie dans ticket");
        
    //    if (req.session.vendToken){
        res.sendFile(__dirname + '/public/ticket.html');
        res.end();
    //    }
    //    else{
    //    res.redirect('https://secure.vendhq.com/connect?response_type=code&client_id=7nN9aYKD42QsLGuLFdR9kWY3rbQIR7cc&redirect_uri=http://milivoy.screeb.io');
    //    res.end();
    //    }
    }
    else {
        console.log("Authentification rate dans authe");
        res.redirect('/login');
        res.end();
    }
});





        //Ouverture de l'écoute io.sockets

io.sockets.on('connection', function (socket, pseudo) {
    
// ECOUTE CONCERNANT LE CHAT

// ---- CONNEXION AU CHAT DUN NOUVEAU CLIENT
    socket.on('ouvertureChat', function() {
 

        var nomUtilisateur = sess.user;
//      pseudo = ent.encode(pseudo);
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
        console.log("socket a reçu la demande");
   
            socket.emit('refus');
    });
    
    
    socket.on('ouvertureTicket', function(tokey){
        
        
        //Partie coton
        
        /*var pg3 = require('pg');
        var conString3 = "postgres://postgres@localhost:5432/db_work";
        var client3 = new pg3.Client(conString);
        client3.connect();
        var query3 = client3.query("SELECT * FROM messages")
        
        query3.on('row', function(row) {
		  try{
			 console.log(row);
              //socket.emit('tickets', {noBon: row.utilisateur, date: row.date});
		  }
		  catch(err){
			 console.log("Problème sur le broadcast");
		  }
	   });
	
	   query3.on('end', function() {
	       client3.end();
	   }); */
        

            var request = require("request");
            var jsonParser = bodyParser.json();
    
    
            var options = { method: 'GET',
                  url: 'https://lacliniqueduportable.vendhq.com/api/register_sales',
                  qs: { outlet_id: '0624dbcd-ef4a-11e6-e0bb-aab07aa5411b' },
                  headers: 
                   { 'cache-control': 'no-cache',
                     accept: 'application/json',
                     'content-type': 'application/json',
                     authorization: sess.vendToken} };

            request(options, function (error, response, body) {
                if (error) throw new Error(error);

                    console.log(body);
                    console.log("ET LA ON PARSE");
                    console.log(JSON.parse(body).pagination.results);
                    var i=0;
                    while (i < Number(JSON.parse(body).pagination.results)){
                        socket.emit('tickets', {noBon: JSON.parse(body).register_sales[i].invoice_number, date: JSON.parse(body).register_sales[i].sale_date});
                        console.log(i);
                        console.log(JSON.parse(body).register_sales[i].invoice_number);
                        i++;
                        
                    };        
            });
    
    }); 

}); 


app.post('/home', upload.array(), function (req, res) { 
    
   var pg2 = require('pg'),
        conString2 = "postgres://postgres@localhost:5432/db_work",
       client2 = new pg2.Client(conString2);
       client2.connect();
    var query2 = client2.query("DELETE FROM session WHERE sid ='" + req.session.id+ "'");
    res.redirect('/login');
});   

//Reception de la requete d'identification




//Renvoie toutes les demandes '/' sur '/home' -> permet de shinté les problèmes avec index.html
/*
app.all('/',function(req,res){

    res.redirect('/home');});
*/



server.listen(8080, "127.0.0.1");

// FONCTIONS DE TEST CONNECTION VENDHQ
function testConnexionVend(sessionToken){
    
    
    
    
}


    
    
    //REPONSE DU SERVER VEND
    //http://milivoy.screeb.io/?code=ES4XpaVk4pfh12ODMpq0fY4aKqn7mM3DnmWMBFtr&domain_prefix=lacliniqueduportable&user_id=874da965-ea9f-11e3-a0f5-b8ca3a64f8f4&signature=86fd73b446fc495d9799f38155e277583313a93850a1591d79023d2463adccf2
    //http://milivoy.screeb.io/?code=i07aJ1jH1qzVl7tEBOf7HAmpkQUEdfuD1yim6irw&domain_prefix=lacliniqueduportable&user_id=874da965-ea9f-11e3-a0f5-b8ca3a64f8f4&signature=61fa80c30d20dabcfbafc0af14e65570ec1d56d0a80f4cea439bbb17798911c1
    
    //ERREUR CAR HTTPREQUEST NEST PAS DANS NODE
    
 
       
    /*
    var data = "code=" + codeV + "&client_id=" + client_idV + "&client_secret=" + client_secretV + "&grant_type=authorization_code&redirect_uri=" + redirect_uriV;
        

        var xhr = new XMLHttpRequest();
        xhr.withCredentials = true;

        xhr.addEventListener("readystatechange", function () {
          if (this.readyState === 4) {
            console.log(this.responseText);
          }
        });

        xhr.open("POST", "https://lacliniqueduportable.vendhq.com/api/1.0/token");
        xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded");
        xhr.setRequestHeader("cache-control", "no-cache");
        xhr.send(data);   
    */
         
/* REPONSE DE VEND
{
    "access_token": "3ZEuZLsLJKBJw5lCe2glzY:pNuJpqiSRZWlUaYpO",
    "token_type": "Bearer",
    "expires": 1491790881,
    "expires_in": 86400,
    "refresh_token": "WOt9BPPcEqQhINmrlNbSo3ItDjYMNljgeBX7W0tF",
    "domain_prefix": "lacliniqueduportable"
}
*/
    
    
   
    
    
    
/*
function connectVendSEC(socket){
    

    
var request = require("request");
var jsonParser = bodyParser.json()
    
    
var options = { method: 'GET',
  url: 'https://lacliniqueduportable.vendhq.com/api/register_sales',
  qs: { outlet_id: '0624dbcd-ef4a-11e6-e0bb-aab07aa5411b' },
  headers: 
   { 'cache-control': 'no-cache',
     accept: 'application/json',
     'content-type': 'application/json',
     authorization: 'Bearer 3ZEuZLsLJKBJw5lCe2glzY:pNuJpqiSRZWlUaYpO' } };

request(options, function (error, response, body) {
  if (error) throw new Error(error);

    console.log(body);
    console.log("ET LA ON PARSE")
    var i=0;
    while (i < Number(JSON.parse(body).pagination.results)){
        socket.emit('tickets', {noBon: JSON.parse(body).register_sales[i].invoice_number, date: JSON.parse(body).register_sales[i].sale_date});
        i++;
        
     } 
    

    
});
     

    
    
    };
*/