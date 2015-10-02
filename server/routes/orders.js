var express = require('express');
var router = express.Router();
var dbConnection = require('../dbconnection');
var logger = require('../logger');
//var bookshelf = require('bookshelf');
var orderJson = require('../data/orderlist.json');

//COMMENTED AS OF NOW

var app = express();

/* GET home page. */
router.get('/', function(req, res, next) {
		
	res.send('get all orders');
});

router.put('/saveOrder', function(req, res, next) {
	logger.log('info','createOrder start');
	var orderObj = req.body.orderObj;

	console.log(orderObj)
	//check for order save mode- create /update
	var orderSaveMode =orderObj.mode ;
	var orderDBFields = {"cust_id":0,
			"orde r_token_no":"0",
			"order_table_no":0,
			"order_total_amt":0.0,
			"order_total_qty":0,
			"order_expct_time":0,
			"order_date":"",
			"order_status":0,
			"order_pay_status":"0",
			"order_mng_emp_id":""};

	var orderedProductsDBFields = {
			"op_order_id":"0",
			"op_prod_id":"0",
			"op_category_id":"0",
			"op_quantity":"0",
			"op_rate":"0",
			"op_amount":"0",
			"op_weight":"0",
			"op_size":"0",
			"op_parcel":"0",
			"op_desc":"0",
			"op_status":"0"};
	
	for(var prop in orderDBFields)
	{
		orderDBFields[prop] = orderObj[prop] ;
	}

	var orderedProdObj = {};
	var orderedProducts = [];
	console.log('- - - - - - - - - - -')
	console.log(orderObj.itemsInOrder);
	for(var i=0;i<orderObj.itemsInOrder.length;i++)
	{	
		angular.forEach(orderedProductsDBFields, function(value, key) {
	  		this[key] = orderObj.itemsInOrder[i][key];
		}, orderedProdObj);	
		
		orderedProducts.push(orderedProdObj);
		console.log('orderedProducts['+JSON.stringify(orderedProducts)+']');
	}
	
	//orderDBFields['itemsInOrder'] = orderedProducts;

	dbConnection.beginTransaction(function(err){

		//console.log(""+req.params);
		if(err){ throw err;}

		logger.log('info','order detail to save['+JSON.stringify(orderDBFields)+']');
		if(orderSaveMode.toLowerCase()=='create')
		{
			//create new order
		}else
		{
			//update existing order
		}
		//insert order into table orders
		var query = dbConnection.query('insert into orders set ?',orderDBFields,function(err,result){
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
				//clearExistingProdsForOrder(orderID);
				addProdsForOrder(orderID,orderedProducts,orderSaveMode);
				
			}//end of result
		});
	});
});

router.get('/lastestOrders', function(req, res){
	res.json(orderJson)
})

router.get('/:id', function(req, res, next) {
	res.send('get order details by id '+ req.params.id);
});

router.delete('/:id', function(req, res, next) {
	res.send('delete order by id '+ req.params.id);
});

app.get("/products",function(req,res){
	console.log(""+res);
})

function addProdsForOrder(orderID,orderedProducts,mode)
{
	if(orderedProducts==undefined || orderedProducts == null)
	{
		res.send({code:'NOPRODS',msg:'No product.'});
		return ;
	}
	logger.log('info','insert items start');
				
	//counter for all insert result 
	var resultCount=0;
	for(var i=0;i<orderedProducts.length;i++)
	{//for start-1
			logger.log('debug','item insert into order_product start['+orderedProducts[i].OP_PROD_ID+']');
			var multiple_insert_item_query = dbConnection.query('insert into order_product set ?',
											orderedProducts[i],function(err,result){
			console.log(multiple_insert_item_query.sql);
			if(err)
			{
				logger.log('error',err.stack);
				dbConnection.rollback(function(err){
					throw err;
				})	

				res.send({code:'ORDER_ITEM_INSERT_FAILED',msg:'Error in order item insert.Please try again!'});
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
							res.send({code:'ORDER_SUBMIT_COMMIT_FAILED',msg:'Error in order create.Please try again!'});	
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
}

function clearExistingProdsForOrder(orderID)
{
	
}


module.exports = router;
