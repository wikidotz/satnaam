var mysql = require('mysql');
var fs = require('fs');

var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'chatnaka_hoteldb'
	
});

/*var knex = require('knex')({
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'root',
    password : 'root',
    database : 'chatnaka_hoteldb',
    charset  : 'utf8'
  }
});

var bookshelf = require('bookshelf')(knex);
*/
var DB_CONNECTED = false;

connection.connect(function(err){
	if(err)
	{
		console.log('Error connecting to db.['+err.stack+']');
		DB_CONNECTED = false;
		return;

	}
	DB_CONNECTED = true;
	console.log('Db connected['+connection.threadId+']');
});
/*knex.connect(function(err){
			if(err)
			{
				console.log('Error connecting to db.['+err.stack+']');
				DB_CONNECTED = false;
				return;

			}
			DB_CONNECTED = true;
			console.log('Db connected'+knex.threadId);
		});*/
		// do not end connection to avoid next db query error 
		//connection.end();

//return dbConnection;
//module.exports =  connection ;
//return instance of bookshelf;
/*var obj = {
	Category : bookshelf.Model.extend({
  		tableName: 'category'
  
	}),

	Customer : bookshelf.Model.extend({
	  tableName: 'customer'
	  
	}),

	OrderedProducts : bookshelf.Model.extend({
	  tableName: 'order_product',
	  parentOrder: function(){
	  	return this.belongsTo(Order);
	  }
	}),

	Order : bookshelf.Model.extend({
	  tableName: 'orders'
	}),

	 Product : bookshelf.Model.extend({
	  tableName: 'product',
	  category: function(){
	  	return this.belongsTo(Category);
	  },

	  BookshelfInst:bookshelf

	})

}*/

module.exports = connection;
//module.exports.bookshelf = bookshelf;