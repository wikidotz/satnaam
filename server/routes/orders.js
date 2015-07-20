var express = require('express');
var router = express.Router();
//COMMENTED AS OF NOW
/*var mysql = require('mysql');
var connection = mysql.createConnection({
	host:'localhost',
	user:'root',
	password:'root',
	database:'satnam'
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

/* GET home page. */
router.get('/', function(req, res, next) {
		
	res.send('get all orders');
});

router.put('/', function(req, res, next) {
	res.send('order created');
});

router.get('/:id', function(req, res, next) {
	res.send('get order details by id '+ req.params. id);
});

router.delete('/:id', function(req, res, next) {
	res.send('delete order by id '+ req.params. id);
});


module.exports = router;
