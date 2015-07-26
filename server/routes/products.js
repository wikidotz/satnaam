var express = require('express');
var router = express.Router();
var http = require('http');
var fs= require('fs');
var Util = require('../util');
var dbConnection = require('../dbconnection');
var ACTIVE_PRODS_GET = 'select * from product';
/* GET home page. */
router.get('/', function(req, res, next) {
	console.log('loading active prods');
	dbConnection.query(ACTIVE_PRODS_GET,function(err,rows,fields){
		if(err)
		{
			console.log(err);
			return ;
		}
		//console.log(rows);
		//var prods = Util.loadJSONfile('sampleproducts.js','utf8');
		
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(rows));	
	});	
		
	
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
