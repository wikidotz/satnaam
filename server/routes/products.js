var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var Util = require('../util');
//var ACTIVE_PRODS_GET = 'select * from product';
var logger = require('../logger');
var mongoose = require('mongoose');
var sampleCat = [];//require('../data/samplecategories.json');

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
});

var Item = mongoose.model('items', ItemSchema);
var ItemCategory = mongoose.model('itemcategories', ItemCategorySchema);

/* GET home page. */
router.get('/', function(req, res, next) {

	Item.find(function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
})

router.get('/categories', function(req, res, next) {

	ItemCategory.find(function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
})

router.get('/category/:category_id', function(req, res, next) {

	Item.find({prod_category_id:parseInt(req.params.category_id)}, function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
})



var indexCat = sampleCat.length-1;

router.get('/addCategory', function(req, res, next){
	console.dir(sampleCat)
	indexCat = sampleCat.length;
	console.dir(indexCat)
	addCats(res);
})

function addCats(res){

	var itemCat = new ItemCategory(sampleCat[indexCat])

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
