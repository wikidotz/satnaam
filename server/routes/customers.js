var express = require('express');
var router = express.Router();
var logger = require('../logger');
var app = express();
var mongoose = require('mongoose');

router.get('/',function(req,res)
{
	res.send('Customers list');
});

router.get('/addCustomer',function(req,res,next)
{
	res.send('Customers list');
});


router.get('/checkAndAddCustomer',function(req,res,next)
{
	
	res.send('Customers list');
})

router.get('/:id',function(req,res,next)
{
	res.send('get customer info by name['+req.params+']');
});

module.exports = router;