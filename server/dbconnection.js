var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'chatnaka_hoteldb'
	
});

var DB_CONNECTED = false;

connection.connect(function(err){
			if(err)
			{
				console.log('Error connecting to db.['+err+']');
				DB_CONNECTED = false;
				return;

			}
			DB_CONNECTED = true;
			console.log('Db connected');
		});
		// do not end connection to avoid next db query error 
		//connection.end();

//return dbConnection;
module.exports =  connection ;