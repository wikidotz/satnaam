var express = require('express');
var router = express.Router();
var logger = require('../logger');
var mongoose = require('mongoose');

var app = express();
var TransactionSchema = new mongoose.Schema({
	order_id:Number,
	order_id_str:String,
	order_total_amt: Number,
	order_total_qty:Number,
	bill_no:Number,
	paid_amt: Number,
	bal_amt: Number,
	tran_date_time:Date,
	modified_by:String,
	last_modified_date_time:Date,
	customer: Object,
	desc:String,
	type:String,
	mode:String
}) 

var Transaction =  mongoose.model('transaction',TransactionSchema);
router.post('/addTransaction',function(req,res,next){
	console.log('server - addTransaction');
	console.log(req.body.transObj);
	var newTrans = new Transaction(req.body.transObj);

	newTrans.last_modified_date_time = new Date();
	newTrans.save(function(err,result){
			if (err) {
		  		console.error(err);
		  		res.send({msg:'Error in transaction save',code:'ERROR',stack:err});
		  		return ;
		  	}
		  	console.log('addTransaction result');
		  	console.log(result);
	  		console.log({msg:'Transaction saved successfully',code:'TRANS_ADDED'}); 
	  		res.send({msg:'Transaction saved successfully',code:'TRANS_ADDED'});	
	})
});

router.post('/addAdvancePayment',function(req,res,next){
	console.log('addAdvancePayment');
	var newTrans = req.body.transaction;
	newTrans.last_modified_date_time = new Date();
	newTrans.save(function(err,result){
		if (err) {
		  		console.error(err);
		  		res.send({msg:'Error in adding advance payment',code:'ERROR',stack:err});
		  		return ;
		  	}
		  	console.log(records);
	  		console.log({msg:'Advance payment saved successfully',code:'ADV_PAYM_TRANS_ADDED'}); 
	  		res.send({msg:'Advance payment saved successfully',code:'ADV_PAYM_TRANS_ADDED'});	
	})
});

router.post('/addBill',function(req,res,next){
	console.log('addBill');
	var newTrans = req.body.transaction;
	newTrans.last_modified_date_time = new Date();
	newTrans.save(function(err,result){
		if (err) {
		  		console.error(err);
		  		res.send({msg:'Error in adding bill',code:'ERROR',stack:err});
		  		return ;
		  	}
		  	console.log(records);
	  		console.log({msg:'Bill saved successfully',code:'BILL_ADDED'}); 
	  		res.send({msg:'Bill saved successfully',code:'BILL_ADDED'});	
	})
});

router.post('/addBillPayment',function(req,res,next){
	console.log('addBillPayment');
	var newTrans = req.body.transaction;
	newTrans.last_modified_date_time = new Date();
	newTrans.save(function(err,result){
		if (err) {
		  		console.error(err);
		  		res.send({msg:'Error in adding bill payment',code:'ERROR',stack:err});
		  		return ;
		  	}
		  	console.log(records);
	  		console.log({msg:'Payment saved successfully',code:'BILL_PAYM_ADDED'}); 
	  		res.send({msg:'Payment saved successfully',code:'BILL_PAYM_ADDED'});	
	})
});

module.exports = router ;