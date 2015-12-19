var express = require('express');
var router = express.Router();
var logger = require('../logger');
var app = express();
var mongoose = require('mongoose');
var Customer = require('../model/customer-model.js');

//fetch customers list
router.get('/customersList',function(req,res)
{
	Customer.find({},function(err,records){
		if(err)
		{
			console.error(err.stack);
			logger.log('level',{error:err});
			res.status(500).send({error:'Error in fetching customer list!'});
		}else
		{
			res.json(records);	
		}
		
	})
	
});

router.get('/addCustomer',function(req,res,next)
{
	var customer = new Customer(req.body);
	console.log('Server - adding new customer');
	console.log(customer);
	customer.last_modified_date_time = new Date();
	customer.defaulter = false;
	customer.save(function(err, records) {
	  
		  	if (err) {
		  		console.error(err);
		  		res.send({msg:'Error in adding new customer',code:'ERROR',stack:err});
		  		return ;

		  	}
		  	console.log('add customer results');
		  	console.log(records);
		  	console.log({msg:'Customer saved successfully',code:'CUSTOMER_ADDED',
		  					cust_id_str:customer._id}); 
	  		res.send({msg:'Customer saved successfully',code:'CUSTOMER_ADDED',
		  					cust_id_str:customer._id});	
	})
});


router.get('/:id',function(req,res,next)
{
	res.send('get customer info by name['+req.params+']');
});

module.exports = router;