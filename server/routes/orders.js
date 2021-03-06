var express = require('express');
var router = express.Router();
var logger = require('../logger');
var orderJson = require('../data/orderlist.json');
var mongoose = require('mongoose');
var Customer = require('../model/customer-model.js');
var CustomerIDCounter = require('../model/customerIDCounter-model.js');
var app = express();

/*var CustomerSchema = new mongoose.Schema({
	name: String,
	mobile:Number
});*/

var OrderSchema = new mongoose.Schema({
	time:Number,
    order_id:Number,
    order_id_str:String,
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
	order_dlv_by:String,
	tableNo:Number,
	paid_amt:Number,
	bal_amt:Number
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
//var Customer = mongoose.model('customers', CustomerSchema);
var MAX_ORDER_TOKEN_NUM= 100;
router.post('/createOrder', function(req, res, next) {

	var order = new Order(req.body.orderObj);
	var customer = new Customer(order.customer);
	Customer.find({mobile:customer.mobile},function(err,matchedCustomer){
		if(err) return console.error(err);
		if(matchedCustomer !=undefined && matchedCustomer.length==0)
		{
			var obj = order.customer;

            CustomerIDCounter.findOneAndUpdate(
                 {_id:'custID'},
                 {"$inc": { "seq": 1 }} ,
                 {"upsert":true,"returnNewDocument":true},
                  function(errc,resc){
                    if(errc)
                        console.error(errc);
                    //returnNewDocuemnt is not working as it is returning old seq
                    obj.custID = resc.seq+1 ;
                    var user = new Customer(obj);

                    user.save(function(err, user) {
                        if (err) return console.error(err);
                        //res.json(user);
                        console.log('orders.js-> new customer added');

                    });
            });
			//new code

		}else{
			console.log('-----------server-orders.js:customer record already exist------------');
		}
	})
	console.log('Server - Creating an order');
	//console.log(order);
	order.order_date_time = new Date();
	order.last_modified_date_time = new Date();
	/*
	Generate first token number before new order creation.
	check last created order in db for the same day, if not found then token num = 1
	if found then get number, increment it by 1 . if more than 100 then make it 1 */
	generateTokenNumber(function(currentTokenNum){
		  order.order_token_no = currentTokenNum;
		  order.save(function(err, records) {

		  	if (err) {
		  		//console.error(err);
		  		res.send({msg:'Error in Order save',code:'ERROR',stack:err});
		  		return ;

		  	}
		  	//console.log('order save results');
		  	//console.log(records);
		  	//console.log({msg:'Order saved successfully',code:'ORDER_CREATED',
		  					//curr_token:currentTokenNum,order_id_str:order._id});
	  		res.send({msg:'Order saved successfully',code:'ORDER_CREATED',
	  			curr_token:currentTokenNum,order_id_str:order._id});

		});

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

router.put('/order/:id', function(req, res){

	Order.findOneAndUpdate({
		_id : req.params.id,
	}, req.body.order, 
	function(err, order){
		if(err){
			res.send(err)
		}

		res.send(order);
	})
})

router.get('/order/:id', function(req, res) {
	Order.findOne({
        _id: req.params.id
    }, function(err, order) {
    	if(err){
    		res.send(err.message);
    		//return err;
    	}
    	res.send(order);
    })
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

/*router.get('/customersList',function(req,res)
{
	console.log('server:fetching customer list.....');
	Customer.find({},function(err,records){

		 if(err)
		 {
		 	console.error(err.stack);
		// 	logger.log('level',{error:'Error in customer list fetching!'})
		// 	res.status(500).send({error:'Error in customer list fetching!'});
		 }else
		 {
		 	console.log(records);
		// 	res.json(records);
		 }

	}).sort('name',-1);
	//res.send('Customers list');

});
*/

app.get("/products",function(req,res){

})

function generateTokenNumber(callBack)
{
	/*The 1 will sort ascending (oldest to newest) and -1 will sort descending (newest to oldest.)
	If you use the auto created _id field it has a date embedded in it ...
	so you can use that to order by ...*/
	Order.find(function(err, result) {
	 //console.log('get last order token number');
	 if(result && result.length>0)
	 {

	 	 //console.log(result[0].order_token_no);
	 	 if(callBack)
	 	 {
	 	 		var lastOrderTokenNum = parseInt(result[0].order_token_no) ;
	 	 		//lastOrderTokenNum = 99;

	 	 		//if token number reached to max then restart it
	 	 		callBack((lastOrderTokenNum==MAX_ORDER_TOKEN_NUM)?1:(lastOrderTokenNum+1));
	 	 }

	 }else{
	 	if(callBack)
	 	 {
	 	 		callBack(1);
	 	 }

	 }
	}).sort({_id:-1}).limit(1)	;

}
module.exports = router;
