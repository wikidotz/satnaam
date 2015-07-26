var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'chatnaka_hoteldb'

});
var ACTIVE_PRODS_GET = 'select * from product';
var DB_CONNECTED = false;

// connection.connect(function(err){
// 			if(err)
// 			{
// 				console.log('Error connecting to db.['+err+']');
// 				DB_CONNECTED = false;
// 				return;

// 			}
// 			DB_CONNECTED = true;
// 			console.log('Db connected');
// 		});


// 		connection.query(ACTIVE_PRODS_GET,function(err,rows,fields){
// 			if(err)
// 			{
// 				throw err;
// 			}
// 			console.log("active products in database["+rows+"]");
// 			if(callback)
// 			{
// 				console.log('calling callback function');
// 				callback();
// 			}
// 		})

// 		connection.end();


var methods = {

	getActiveProducts : function(callback){
		connection.connect(function(err){
			if(err)
			{
				console.log('Error connecting to db.['+err+']');
				DB_CONNECTED = false;
				return ;

			}
			DB_CONNECTED = true;
			console.log('Db connected');
		});


		connection.query(ACTIVE_PRODS_GET,function(err,rows,fields){
			if(err)
			{
				throw err;
			}
			console.log("active products in database["+rows+"]");
			var resultJson = JSON.stringify(rows);
			console.log("json products in database["+resultJson+"]");
			if(callback)
			{
				console.log('calling callback function');
				callback(resultJson);
			}
		})

		connection.end();
	}
}



//return dbConnection;
module.exports =  methods ;