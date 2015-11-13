var express = require('express');
var router = express.Router();
//var dbConnection = require('../dbconnection');
var logger = require('../logger');
//var bookshelf = require('bookshelf');
var orderJson = require('../data/orderlist.json');
var mongoose = require('mongoose');

var app = express();

var Customer = new mongoose.Schema({
	name: String,
	mobile:Number
});

var OrderSchema = new mongoose.Schema({
	time:Number,
    itemsInOrder: Array,
    customer: Object,
	order_mng_emp_id: Number,
	order_pay_status: String,
	order_status: Number,
	order_token_no: Number,
	order_total_amt: Number,
	order_total_qty: Number
});

var Order = mongoose.model('orders', OrderSchema);

router.post('/createOrder', function(req, res, next) {

	var order = new Order(req.body.orderObj);

	order.save(function(err, thor) {
	  	if (err) return console.error(err);
	  	console.dir('saved');
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

app.get("/products",function(req,res){
	console.log(""+res);
})


module.exports = router;
