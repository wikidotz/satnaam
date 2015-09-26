var express = require('express');
var router = express.Router();
var http = require('http');
var fs= require('fs');
var Util = require('../util');
var dbConnection = require('../dbconnection');
var ACTIVE_PRODS_GET = 'select * from product';
var logger = require('../logger');
/* GET home page. */
router.get('/', function(req, res, next) {
	logger.log('info','Loading active products');

	/*dbConnection.Product.collection().fetch().then(function(collection){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(collection));	
	},function(err){
		if(err)
		{
			logger.log('error',err);
		}

	})*/
	
	dbConnection.query(ACTIVE_PRODS_GET,function(err,rows,fields){
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

	/*console.log(dbConnection.Product);
	dbConnection.Product.fetch().then(function(collection){
		console.log(collection.toJSON());
	})*/
	
});

router.put('/', function(req, res, next) {
	res.send('product added');
});

router.get('/:id', function(req, res, next) {
	res.send('get product by id '+ req.params. id);
});

router.delete('/:id', function(req, res, next) {
	res.send('delete product by id '+ req.params. id);
});


module.exports = router;
