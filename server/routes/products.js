var express = require('express');
var router = express.Router();
var http = require('http');
var fs= require('fs');
var Util = require('../util');
var dbConnection = require('../dbconnection');
/* GET home page. */
router.get('/', function(req, res, next) {
	
	var prodsFromDb  = dbConnection.getActiveProducts(
		function(){
		console.log("products fetched from json");
		console.log(prodsFromDb);
	 	
	});
	var prods = Util.loadJSONfile('sampleproducts.js','utf8');
	res.setHeader('Content-Type', 'application/json');
	res.send(JSON.stringify(prods));	
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
