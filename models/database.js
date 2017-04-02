const pg = require('pg');
const connectionString = process.env.DATABASE_URL || 'postgres://postgres@localhost:5432/db_work';

const client = new pg.Client(connectionString);
client.connect();
const query = client.query(
  'CREATE TABLE messages(id SERIAL PRIMARY KEY, utilisateur VARCHAR(40), message VARCHAR(200), date TIMESTAMP)');
query.on('end', () => { client.end(); });
