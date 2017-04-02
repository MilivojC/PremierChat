var pg = require('pg');
var conString = "postgres://postgres@localhost:5432/db_work";

var client = new pg.Client(conString);
client.connect();

//queries are queued and executed one after another once the connection becomes available
var x = 1000;

while (x > 0) {
    client.query("INSERT INTO items(text, complete) values('Ted',true)");
    client.query("INSERT INTO items(text, complete) values($1, $2)", ['John'+ x.toString() , false]);
    x = x - 1;
}

var query = client.query("SELECT * FROM items");
//fired after last row is emitted

query.on('row', function(row) {
    console.log(row);
});

query.on('end', function() {
    client.end();
});

