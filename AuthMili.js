var verif = function(nom, pass) {
    var ver = new Boolean(false);
    var pg = require('pg'),
        conString = "postgres://postgres@localhost:5432/db_work",
        client = new pg.Client(conString);
        client.connect();
    var query = client.query("SELECT * FROM identification WHERE nigol ='" + nom +"'");
    
    query.on('row', function(row) {
		
        if (row.drowssap === pass && row.nigol === nom){
            
            ver = true;
        }

	});
	
	query.on('end', function() {
	    client.end();
	});
    
    
    
    return [ver, nom];
    
};


exports.verif = verif;