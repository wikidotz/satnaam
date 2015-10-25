var express = require('express');
var router = express.Router();
var http = require('http');
var fs= require('fs');
var Util = require('../util');
var ACTIVE_PRODS_GET = 'select * from product';
var logger = require('../logger');
var mongoose = require('mongoose');

mongoose.connect('mongodb://admin:root@ds039504.mongolab.com:39504/chartnaka');

var ItemSchema = new mongoose.Schema({
    prod_id: Number,
    prod_category_id: Number,
    prod_name: String,
    prod_dispname: String,
    prod_desc: String,
    prod_ingredients: String,
    prod_rate: Number,
    prod_available: Number,
    prod_size: Number,
    prod_weight: Number,
    prod_veg_nonveg: Number,
    prod_pre_time: Number,
    prod_created_by: String,
    prod_created_date: Date,
    prod_modified_by: String,
    prod_modified_date: Date
});

var Item = mongoose.model('items', ItemSchema);

/* GET home page. */
router.get('/', function(req, res, next) {

	Item.find(function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
})

/*
router.get('/', function(req, res, next) {
	logger.log('info','Loading active products');
*/
	/*dbConnection.Product.collection().fetch().then(function(collection){
		res.setHeader('Content-Type', 'application/json');
		res.send(JSON.stringify(collection));	
	},function(err){
		if(err)
		{
			logger.log('error',err);
		}

	})*/

/*
	
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
*/

	/*console.log(dbConnection.Product);
	dbConnection.Product.fetch().then(function(collection){
		console.log(collection.toJSON());
	})*/
	
//});

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
