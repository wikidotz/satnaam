var express = require('express');
var router = express.Router();
var http = require('http');
var fs = require('fs');
var Util = require('../util');
//var ACTIVE_PRODS_GET = 'select * from product';
var logger = require('../logger');
var mongoose = require('mongoose');
var sampleCat = require('../data/samplecategories.json');
var sampleItems = require('../data/sampleproducts_v2.json');

autoIncrement = require('mongoose-auto-increment');
var db = mongoose.connection;
autoIncrement.initialize(db);

var ItemSchema = new mongoose.Schema({
	prod_id: Number,
    prod_category_id: { type: Number},
    prod_category_name: String,
    prod_name: String,
    prod_dispname: String,
    prod_desc: String,
    prod_ingredients: String,
    prod_rate: Number,
    prod_available: Boolean,
    prod_size: String,
    prod_weight: String,
    prod_veg_nonveg: String,
    prod_pre_max_time_sec: Number
});


var Item = mongoose.model('items', ItemSchema);

ItemSchema.plugin(autoIncrement.plugin, { 
	model: 'items', 
	field: 'prod_id', 
	startAt:1,
	incrementBy:1
});


var ItemCategorySchema = new mongoose.Schema({
	category_id: {type:Number},
    category_name: String
});

var ItemCategory = mongoose.model('itemcategories', ItemCategorySchema);


ItemCategorySchema.plugin(autoIncrement.plugin, { 
	model: 'itemcategories', 
	field: 'category_id', 
	startAt:1,
	incrementBy:1
});


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

router.post('/categories/category', function(req, res) {
	var itemCategory = new ItemCategory(req.body);
	itemCategory.save(function(err, result) {
		if (err) {
			res.status(500).send(err.message)
		}
		res.send(result);
	});
})

router.get('/category/:category_id', function(req, res, next) {

	Item.find({prod_category_id:parseInt(req.params.category_id)}, function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
})


router.get('/:id', function(req, res, next) {
	res.send('get product by id mukesh '+ req.params.id);
});

router.delete('/:id', function(req, res, next) {
	res.send('delete product by id '+ req.params. id);
});


var indexCat = sampleCat.length-1;
var indexItem = sampleItems.length-1;

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
router.get('/:id/addItem', function(req, res, next){
  console.log("adding item......")
	indexItem = sampleItems.length-1;
	//console.dir(indexItem);
	addItem();
  res.send("add item result");
})


function addItem(){
  var item = new Item(sampleItems[indexItem]);
  //console.log("new item to add ["+JSON.parse(item)+"]");//pass item to add
  item.save(function(err,res1){
    if(err) return console.error(err);
    console.log('item saved['+indexItem+']');
    indexItem--;
    if(indexItem>=0)
    {
       addItem();
    }else{
      res.send("Items are added.");
    }

  })
}

/* dhiraj */

router.put('/product/:id', function(req, res) {

	console.log(typeof req.params.id)

	Item.update({
        prod_id: parseInt(req.params.id)
    }, { $set: req.body.product}, { multi: false }, function(err, doc){
    	if(err) {
			res.status(500).send(err.message)
		}
		res.send(doc)
    })
})

router.post('/product', function(req, res) {
	console.log(req.body.product);
	var item = new Item(req.body.product);
	item.save(function(err, itemRes){
		if(err) {
			res.status(500).send(err.message)
		}
		res.send(itemRes)
	})
})

router.delete('/product/:id', function(req, res) {
	
	Item.find({
        prod_id: req.params.id
    }).remove().exec();
    res.send({
        message: 'ok'
    });
})




module.exports = router;
