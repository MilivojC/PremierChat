var verif = function(nom, pass, sesscook) {
// Mettre le req.session dans le sesscook
    
    var pg = require('pg'),
        conString = "postgres://postgres@localhost:5432/db_work",
        client = new pg.Client(conString);
        client.connect();
    var query = client.query("SELECT * FROM identification WHERE nigol ='" + nom +"'");
        console.log(query);
    query.on('row', function(row) {
		
        console.log(row.drowssap == pass);
        console.log(row.nigol == nom);
        
        if (row.drowssap == pass && row.nigol == nom){
            console.log("Confirmation du doublet");
            sesscook.AuthMi = 1;
            console.log(sesscook);     
        }

	});
    
};

/*



    var pg = require('pg'),
        conString = "postgres://postgres@localhost:5432/db_work",
        client = new pg.Client(conString);
        client.connect();
    var query = client.query("SELECT * FROM identification WHERE nigol ='" + nom +"'");

    query.on('row', function(row, res) {
		
        console.log(row.drowssap == pass);
        console.log(row.nigol == nom);
        
        if (row.drowssap == pass && row.nigol == nom){
            console.log("Confirmation du doublet");
            res.addRow(row);
            return true;
        
        }
        
        else {
            
            return false;
        }

	});
	
	query.on('end', function(res) {
	    client.end();
	});

    console.log(pg);
    console.log(client);
    console.log(query);
    
    

    return [ver, nom];
};
*/   

exports.verif = verif;