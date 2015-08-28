var express = require('express');
var router = express.Router();
var dbConnection = require('../dbconnection');
var logger = require('../logger');
var bookshelf = require('bookshelf')
//COMMENTED AS OF NOW

var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
		
	res.send('get all orders');
});

router.put('/createOrder', function(req, res, next) {
	
	var orderObj = req.params.orderDetail;
	 orderObj = {
	 		"cust_id":1,
			"order_token_no":"1",
			"order_table_no":1,
			"order_total_amt":100.00,
			"order_total_qty":2,
			"order_expct_time":1200,
			"order_date":"2015-07-20 13:16:00",
			"order_status":1,
			"order_pay_status":"0",
			"order_mng_emp_id":""
	 }
	//console.log(dbConnection);

	dbConnection.bookshelf.transaction(function(transaction){
		dbConnection.Order.forge(orderObj).save().then(function(){
			console.log('creating an order');
			transaction.commit();
		},
		function(err){
			console.log(err);
			transaction.rollback();
		})	
	})
	
});

router.put('/createOrder1', function(req, res, next) {
	dbConnection.beginTransaction(function(err){

		console.log(""+req.params);
		if(err){ throw err;}

		logger.log('info','createOrder start');
		//remove hard code products
		var orderObj = req.params.orderDetail;//map of table orders
		/*var post = {
			//"order_id":"1",
			"cust_id":1,
			"order_token_no":"1",
			"order_table_no":1,
			"order_total_amt":100.00,
			"order_total_qty":2,
			"order_expct_time":1200,
			"order_date":"2015-07-20 13:16:00",
			"order_status":1,
			"order_pay_status":"0",
			"order_mng_emp_id":"",
		};*/
		//insert order into table orders
		var query = dbConnection.query('insert into orders set ?',orderObj,function(err,result){
			if(err)
			{
				logger.log('error',err.stack+'\n'+query.sql);

				dbConnection.rollback(function(err){
					throw err;
				})
				res.send({code:'ORDER_SUBMIT_FAILED',msg:'Error in order create.Please try again!'});
			}

			if(result)
			{
				
				logger.log('info','New orderID['+result.insertId+']');
				logger.log('info','createOrder end');

				var orderID = result.insertId;
				logger.log('info','insert items start');
				var orderedProducts = req.params.itemsInOrder ;
				//remove hard code data after testing
				/*orderedProducts = [
  {'OP_ORDER_ID':orderID,'OP_PROD_ID':1,'OP_CATEGORY_ID':1,'OP_QUANTITY':1,'OP_RATE':30.00,'OP_AMOUNT':30.00,'OP_WEIGHT':null,'OP_SIZE':null,'OP_PARCEL':0,'OP_DESC':'mix','OP_STATUS':1},
 {'OP_ORDER_ID':orderID,'OP_PROD_ID':2,'OP_CATEGORY_ID':1,'OP_QUANTITY':1,'OP_RATE':30.00,'OP_AMOUNT':30.00,'OP_WEIGHT':null,'OP_SIZE':null,'OP_PARCEL':0,'OP_DESC':'mix','OP_STATUS':1},
 {'OP_ORDER_ID':orderID,'OP_PROD_ID':3,'OP_CATEGORY_ID':1,'OP_QUANTITY':1,'OP_RATE':30.00,'OP_AMOUNT':30.00,'OP_WEIGHT':null,'OP_SIZE':null,'OP_PARCEL':0,'OP_DESC':'mix','OP_STATUS':1}]*/
 				
 				//counter for all insert result 
 				var resultCount=0;
 					for(var i=0;i<orderedProducts.length;i++)
 					{
 							logger.log('debug','item insert into order_product start['+orderedProducts[i].OP_PROD_ID+']');
 							var multiple_insert_item_query = dbConnection.query('insert into order_product set ?',orderedProducts[i],function(err,result){
			 					console.log(multiple_insert_item_query.sql);
			 					if(err)
			 					{
			 						logger.log('error',err.stack);
									dbConnection.rollback(function(err){
										throw err;
									})	
									res.send({code:'ORDER_SUBMIT_FAILED',msg:'Error in order create.Please try again!'});
			 					}


			 					if(result)
			 					{
			 						logger.log('debug','item insert into order_product end');
			 						resultCount++;
			 						if(resultCount == orderedProducts.length)
			 						{
			 							dbConnection.commit(function(err){
											if(err)
											{
												logger.log('error',err.stack);
												dbConnection.rollback(function(err){
													throw err;
												})	
												res.send({code:'ORDER_SUBMIT_FAILED',msg:'Error in order create.Please try again!'});	
											}//end of err loop
											if(result)
											{
												logger.log("info","order created successfully.OrderID["+orderID+"]");
												//dbConnection.end();
												res.send({code:'ORDER_SUBMIT_SUCCESS',msg:'order created successfully.'});
											}
										})
			 						}//end of if conditin
			 					}//end of result loop
									
 							})//end of function loop
 					
 				}//end of for loop
			}//end of result
		});
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
