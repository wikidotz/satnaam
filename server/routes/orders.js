var express = require('express');
var router = express.Router();
var dbConnection = require('../dbconnection');
//COMMENTED AS OF NOW

var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
		
	res.send('get all orders');
});

router.put('/', function(req, res, next) {
	console.log('saving order details');
	//hard code products
	var post = {
		"order_id":"1",
		"cust_id":"1",
		"order_token_no":"1",
		"order_table_no":"1",
		"order_total_amt":"100.00",
		"order_total_qty":"2",
		"order_expct_time":"1200",
		"order_date":"2015-07-20 13:16:00",
		"order_status":"1",
		"order_pay_status":"0",
		"order_mng_emp_id":"",
	};
	var query = dbConnection.query('insert into orders values ?',post,function(err,result){
		if(err)
		{
			console.log(err);
			res.send('order failed');
		}

		if(result)
		{
			console.log(result);
			res.send('order created');
		}
	})

	console.log(query);
	
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
