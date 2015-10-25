var express = require('express');
var router = express.Router();
var logger = require('../logger');
var app = express();

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
	

});

router.put('/addCustomer', function(req, res, next) {
	
	//var custObj = req.params.customerDetail;
	//console.log(""+JSON.stringify(custObj)); 
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
