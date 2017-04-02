//test pour la selection de ligne en js
var pg = require('pg');
var conString = "postgres://postgres@localhost:5432/db_work";

var client = new pg.Client(conString);
client.connect();

var query = client.query("SELECT * FROM messages");
//fired after last row is emitted

query.on('row', function(row) {
    console.log(row);
});

query.on('end', function() {
    client.end();
});
