var verif = function(nom, pass) {
  var ver = function(){
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
            return true;
        
        }

	});
	
	query.on('end', function() {
	    client.end();
	});
};
    console.log([ver(), nom]);
    return [ver(), nom];
};
exports.verif = verif;