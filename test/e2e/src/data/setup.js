var mysql = require('mysql');

console.log('--- SETUP ---');

// --- Reset database
var DB_NAME = 'ezactive_sgb';
var DB_USER = 'root';
var DB_PASSWORD = '';
var DB_HOST = 'localhost';

var QUERY = "DELETE FROM `users` WHERE email = 'player@gmail.com'";
var db = mysql.createConnection({
	host: DB_HOST,
	user: DB_USER,
	password: DB_PASSWORD,
	database: DB_NAME
});
db.connect(function(err) {
	if (err) 
		throw err;
	db.query(QUERY, function (err, result, fields) {
		if (err) {
			console.log('ERROR - query, err = ', err);
		} else {
			// console.log('OK - query, result = ', result);
			console.log('OK - query');
		}
		console.log('--- END SETUP ---');
	});
});
