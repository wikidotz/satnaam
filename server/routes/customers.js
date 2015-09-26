var express = require('express');
var router = express.Router();
var dbConnection = require('../dbconnection');
var logger = require('../logger');
var app = express();
var ACTIVE_CUST_GET = 'select * from customer';

router.get('/', function(req, res, next) {
		
	logger.log('info','Loading all customers');

	/*dbConnection.Customer.collection().fetch().then(function(collection){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(collection));	
	},function(err){
		if(err)
		{
			logger.log('error',err);
		}

	})*/
	dbConnection.query(ACTIVE_CUST_GET,function(err,rows,fields){
			if(err)
			{
				logger.log('error',err);
				return ;
			}
			//console.log(rows);
			//var prods = Util.loadJSONfile('sampleproducts.js','utf8');
			
			res.setHeader('Content-Type', 'application/json');
			res.send(JSON.stringify(rows));	
	});

});

router.put('/addCustomer', function(req, res, next) {
	
	var custObj = req.params.customerDetail;
	console.log(""+JSON.stringify(custObj)); 
	/*dbConnection.bookshelf.transaction(function(transaction){
		dbConnection.Customer.forge(custObj).save().then(function(){
			console.log('customer entry added');
			transaction.commit();
		},
		function(err){
			console.log(err);
			transaction.rollback();
		})	
	})*/
	
});


router.get('/:id', function(req, res, next) {
	res.send('get customer details by id '+ req.params.id);
});

router.delete('/:id', function(req, res, next) {
	res.send('delete customer by id '+ req.params.id);
});

module.exports = router;
