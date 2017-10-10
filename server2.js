// Fichier serveur pour milivoy.screeb.io
var express = require('express'), 
    app = require('express')(),
    server = require('http').createServer(app); //Creation serveur
/*    io = require('socket.io').listen(server), // Ecouteur client/serveur
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs'),// Construction html

    pg = require('pg'),// Gestion session/cookie
    session = require('express-session'),// Gestion session/cookie
    bodyParser = require('body-parser'),
    pgSession = require('connect-pg-simple')(session);// Gestion session/cookie
    // Ajout pour récupération de POST
var multer = require('multer'); // v1.0.5
var upload = multer(); // for parsing multipart/form-data
var keys = require('./.keysVend');

*/
// Suivi de session
/*    
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

*/
app.get('/', function (req, res) {    
/*
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
    */
    
    res.sendFile(__dirname + '/public/home2.html');
    
});


/*
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
    //Si l'utilisateur n'a pas encore d'autorisation
    if(req.query.code != undefined){
            //On récupère le code de validation client
            var code = req.query.code;
            console.log("code :/"+ code);
            //On construit la requete faite a vend pour obtenir le token
            var codeV =  code,
                client_idV = keys.client_id,
                client_secretV = keys.client_secret,
                redirect_uriV = keys.redirect_uri;
                //var request = require("request");
                var rp = require('request-promise');
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
                            },
                        json: true
                };

            var rp1 = rp(options).then(function(body){
                req.session.vendToken = body.access_token;
            }).catch(function (err){
                console.log("Erreur rp");
            });
    
                 setTimeout(function(){
                res.redirect('/home');
            }, 10000);   
    
    
    
    
    } else {
        
        res.redirect('/home');
    }
    

        
});


app.get('/ticket', function (req, res) {    
 console.log(req.session);
    sess = req.session

    if (req.session.AuthMi === 1){
        console.log("Authentification reussie dans ticket");
        
    if (req.session.vendToken){
        res.sendFile(__dirname + '/public/ticket.html');
        res.end();
        }
        else{
        res.redirect(keys.demande_client);
        res.end();
        }
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
        
            var nomUtilisateur = sess.user;
//          pseudo = ent.encode(pseudo);
            socket.pseudo = nomUtilisateur;
            socket.emit('acceptationTicket', nomUtilisateur)

    }); 

    
    socket.on('recherche_no', function( magasin , no_bon){
        
         var request = require("request");
        var jsonParser = bodyParser.json();
        var cherbon = String(no_bon);
        // ON VA DANS UN PREMIER TEMPS LANCE LA REQUETE POUR AVOIR LE NOMBRE DE PAGE
        var noPage = 1;
        var nbrPages = 500;
        while (noPage <= nbrPages) {
        var options = { method: 'GET',
            url: 'https://' + keys.prefix_client + '.vendhq.com/api/register_sales?page=' + noPage,
            qs: { outlet_id: magasin },
            headers: 
                {   'cache-control': 'no-cache',
                    accept: 'application/json',
                    'content-type': 'application/json',
                    authorization: "Bearer " + sess.vendToken} };
            
            try {
        request(options, function (error, response, body) {
            
            if (error) throw new Error(error);
            var i=0;
            
            while (i < 50){
                
                
                
                try {
                var chernom = JSON.parse(body).register_sales[i].invoice_number.substr(6); 
                    if (chernom === cherbon) {
                
                        socket.emit('tickets', {noBon: JSON.parse(body).register_sales[i].invoice_number, date: JSON.parse(body).register_sales[i].sale_date});
                        console.log("on a trouve!");
                        
                       } ;
                
                console.log(JSON.parse(body).register_sales[i].invoice_number);
            
                } catch(e) {
                    
                    console.log("Pas reussi mais je tourne toujours");
                };
                i++;
             }; 

            });
            
                } catch(e) {
            
                break;
                }
            
            noPage++;

        } 
        
        
        
        /*
        
        // ON VA CHERCHER DANS LA BASE DE VEND AVEC REQUEST
        

    
                while(i==1){
                    
                var options = { method: 'GET',
                  url: 'https://' + keys.prefix_client + '.vendhq.com/api/register_sales?page=2',
                  qs: { outlet_id: '0624dbcd-ef4a-11e6-e0bb-aab07aa5411b' },
                  headers: 
                   { 'cache-control': 'no-cache',
                     accept: 'application/json',
                     'content-type': 'application/json',
                     authorization: "Bearer " + sess.vendToken} };
        
        console.log(options);

            request(options, function (error, response, body) {
                if (error) throw new Error(error);
                    console.log("ET LA ON PARSE");
                    console.log(JSON.parse(body).pagination.results);
                    var i=0;
                    while (i < 50){
                        socket.emit('tickets', {noBon: JSON.parse(body).register_sales[i].invoice_number, date: JSON.parse(body).register_sales[i].sale_date});
                        console.log(i);
                        console.log(JSON.parse(body).register_sales[i].invoice_number);
                        i++;
                        
                       } 
                        
                    });  
                    
                }
                    
            });
        
        
        
        console.log("Le client demande qu'on lui envoi le bon "+ no_bon + " du magasin " + magasin);
      * /
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

app.post('/listenmyapp',upload.array(), function (req, res) {
    console.log(req.body);
    res.send("Success");  
});

*/

server.listen(8080, "127.0.0.1");