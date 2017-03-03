var mongoose = require('mongoose');
var config = require('./config');

mongoose.connect(config.database);

mongoose.connection.on('connected', function () {  
  console.log('Mongoose default connection open to ' + config.database);
}); 

// If the connection throws an error
mongoose.connection.on('error',function (err) {  
  console.log('Mongoose default connection error: ' + err);
}); 

// When the connection is disconnected
mongoose.connection.on('disconnected', function () {  
  console.log('Mongoose default connection disconnected'); 
});

exports = mongoose;