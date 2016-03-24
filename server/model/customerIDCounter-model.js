var mongoose = require('mongoose');

var CustomerIDCounterSchema = new mongoose.Schema({
	 _id: String,
      seq: Number
});

var CustomerIDCounter = mongoose.model('customeridcounters',CustomerIDCounterSchema);

module.exports = CustomerIDCounter;