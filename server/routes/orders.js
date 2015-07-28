var express = require('express');
var router = express.Router();
var dbConnection = require('../dbconnection');
//COMMENTED AS OF NOW
/*var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'chatnaka_hoteldb'
});


connection.connect();
connection.query('select * from customer',function(err,rows,fields){
	if(err)
	{
		throw err;
	}
	console.log("customers in database["+rows+"]");
})
connection.end();
*/
var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
		
	res.send('get all orders');
});

router.put('/', function(req, res, next) {
	console.log('saving order details');
	var query = dbConnection.query('insert into orders values ?',post,function(err,result){
		if(err)
		{
			console.log(err);
			res.send('order failed');
		}

		if(result)
		{
			console.log(result);
			res.send('order created');
		}
	})

	console.log(query);
	
});

router.get('/:id', function(req, res, next) {
	res.send('get order details by id '+ req.params.id);
});

router.delete('/:id', function(req, res, next) {
	res.send('delete order by id '+ req.params.id);
});

app.get("/products",function(req,res){
	console.log(""+res);
})

module.exports = router;
