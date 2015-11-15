var express = require('express');
var router = express.Router();
//var dbConnection = require('../dbconnection');
var logger = require('../logger');
//var bookshelf = require('bookshelf');
var orderJson = require('../data/orderlist.json');
var mongoose = require('mongoose');

var app = express();

var CustomerSchema = new mongoose.Schema({
	name: String,
	mobile:Number
});

var OrderSchema = new mongoose.Schema({
	time:Number,
    order_id:Number,
	order_token_no: Number,
	customer: Object,
	order_date_time:Date,
	itemsInOrder: Array,
	order_pay_status: String,
	order_status: Number,
	modified_by:String,
	last_modified_date_time:Date,
	delivery_mode:String,
	is_scheduled:Number,
	scheduled_date_time:Date,
	order_total_amt: Number,
	order_total_qty: Number,
	order_dlv_by:String
});


/*var OrderProductMappingSchema = new mongoose.Schema({
	opm_or_id:Number,
	opm_prod_id:Number,
  	opm_prod_name:String,
  	opm_prod_desc:String,
  	opm_prod_quantity:Number,
  	opm_prod_rate:Number,
  	opm_discount:Number,
  	opm_net_rate:Number,
  	opm_prod_category_id:Number,
  	last_modified_date_time:Date,
  	last_modified_by:String
});*/

var Order = mongoose.model('orders', OrderSchema);
var Customer = mongoose.model('customers', CustomerSchema);

router.post('/createOrder', function(req, res, next) {

	var order = new Order(req.body.orderObj);
	var customer = new Customer(order.customer);
	
	Customer.find({mobile:customer.mobile},function(err,matchedCustomer){
		if(err) return console.error(err);
		if(matchedCustomer !=undefined && matchedCustomer.length==0)
		{
			customer.save(function(err,result){
					if(err)console.error(err);
			})
		}	
	})
	console.log('Creating an order');
	console.log(order);
	order.order_date_time = new Date();
	order.last_modified_date_time = new Date();
	
	order.save(function(err, records) {
	  	if (err) return console.error(err);
	  	console.dir('saved');
	  	console.log(records);
	  	res.send({msg:'saved'});
	});

})


router.get('/', function(req, res, next) {
		
	Order.find(function(err, result) {
	 	if (err) return console.error(err);
	 	res.send(result);
	});

});


router.get('/:status', function(req, res, next) {
		
	Order.find({ 'order_status': req.params.status }, function(err, result) {
	  if (err) return console.error(err);
	  res.send(result);
	});
});

router.get('/:id', function(req, res, next) {
	res.send('get order details by id '+ req.params.id);
});

router.delete('/:id', function(req, res, next) {
	res.send('delete order by id '+ req.params.id);
});

router.get('checkMobileExist/:mobilenumber',function(req,res,next){
	Customer.find({mobile:mobilenumber},function(err,matchedCustomer){
		if(err) return console.error(err);
		res.send(matchedCustomer);	
	})	
});
app.get("/products",function(req,res){
	console.log(""+res);
})


module.exports = router;
