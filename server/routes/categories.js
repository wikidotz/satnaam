var express = require('express');
var router = express.Router();

router.get('/',function(req,res,next){
	
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