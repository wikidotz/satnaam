var express = require('express');
var router = express.Router();
var http= require('http');
var dbConnection= require('../dbConnection');
var ACTIVE_CATEGORIES_GET = 'select * from category';

router.get('/',function(req,res,next){
	console.log('fetching active categories');
	dbConnection.query(ACTIVE_CATEGORIES_GET,function(err,rows,fields){
		if(err)
		{
			console.log(err);
		}else
		{
			res.setHeader('Content-Type','application/json');
			res.send(JSON.stringify(rows));
		}
	})
});

router.put('/',function(req,res,next){
	res.send('category added');
});

router.get('/:id',function(req,res,next){
	res.send('get category by id '+req.params.id);
});

router.delete('/:id',function(req,res,next){
	res.send('deleting category id '+req.params.id);
});

module.exports = router;