var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var Util = require('../util');
//var ACTIVE_PRODS_GET = 'select * from product';
var logger = require('../logger');
var mongoose = require('mongoose');
//var sampleCat = [];//require('../data/samplecategories.json');
//var sampleProd = require('../data/sampleproducts.json');
var Q = require("q");

var ItemSchema = new mongoose.Schema({
    prod_id: Number,
    prod_category_id: Number,
    prod_name: String,
    prod_dispname: String,
    prod_desc: String,
    prod_ingredients: String,
    prod_rate: Number,
    prod_available: Number,
    prod_size: String,
    prod_weight: String,
    prod_veg_nonveg: String,
    prod_pre_max_time_sec: Number,
    prod_modified_by: String,
    prod_modified_date: Date
});


var ItemCategorySchema = new mongoose.Schema({
	category_id: Number,
    category_name: String,
    modified_by: String,
    modified_date: Date
})
var Item = mongoose.model('items', ItemSchema);
var ItemCategory = mongoose.model('itemCategories', ItemCategorySchema);

/* GET home page. */
router.get('/', function(req, res, next) {

	Item.find(function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
})

router.get('/itemCategories', function(req, res, next) {

	ItemCategory.find(function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
})

/*var indexCat = sampleProd.length-1;

router.get('/addCategory', function(req, res, next){
	console.dir(sampleProd)
	indexCat = sampleProd.length;
	console.dir(indexCat)
	addCats(res);
})*/

/*router.get('/addProduct', function(req, res, next){
	console.dir(sampleProd)
	indexCat = sampleProd.length;
	console.dir(indexCat)
	addCats(res);
})

function addCats(res){

	var itemCat = new Item(sampleProd[indexCat])

	itemCat.save(function(err, thor) {
	  	if (err) return console.error(err);
	  	console.dir('saved'+indexCat);
	  	indexCat--;
	  	if(indexCat >= 0){
	  		addCats(res);
	  	}else{
	  		console.dir('complete');
	  		res.send({})
	  	}
	});
}
*/
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
