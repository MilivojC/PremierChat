//ICI ON STOCK LES FONCTIONS DONT ON SE SERT DANS LE SERVEUR (ET NON PAS COTE CLIENT)

// ZONE DAPPEL DES FONCTIONS POUR REALISER LES TESTS

donnedate();






//DEFINITION DES FONCTIONS


//FONCTION DE CONSULTATION

function donnedate() {

	var pg = require('pg');
	var conString = "postgres://postgres@localhost:5432/db_work";
	var client = new pg.Client(conString);

	client.connect();
	var query = client.query("SELECT * FROM messages WHERE date IS NOT NULL");

	query.on('row', function(row) {

		console.log(transdate(row.date, "sqltojs"));
	});
	
	query.on('end', function() {
        	client.end();
    	});

};



// FONCTION TRANSFORMATION
