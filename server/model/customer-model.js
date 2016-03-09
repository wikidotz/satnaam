// grab the things we need
var mongoose = require('mongoose');
//var Schema = mongoose.Schema;

var CustomerSchema = new mongoose.Schema({
	custID:Number,
	name: String,
	nameCalled:String,
	mobile:Number,
	email:String,
	bldgName:String,
	bldgWing:String,
	bldgRoomNo:String,
	landmark:String,
	city:String,
	address: String,
	last_modified_date_time: Date,
	desc:{type:String,default:null},
	defaulter:{type:Boolean,default:false}
});
var Customer = mongoose.model('customers', CustomerSchema);

// make this available to our Customers in our Node applications
module.exports = Customer;