var express = require('express');

var bodyParser = require('body-parser');
var expressSession = require('express-session');
var productsRoutes = require('./routes/products')
var categoriesRoutes = require('./routes/categories');
var customersRoutes = require('./routes/customers');
var orderRoutes = require('./routes/orders');
var bookshelf = require('bookshelf');
var mongoose = require('mongoose');
//var dbConnection = require('./dbconnection');
var app = express(); 

app.use(expressSession({
    secret: 'mySecretKey'
}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(express.static(__dirname + '../../client'));

//mongoose.connect('mongodb://localhost:27017/test');


function checkAuth(req, res, next) {
    if (!req.session.user_id) {
        res.send('You are not authorized to view this page');
    } else {
        next();
    }
}

app.get('/loggedIn', checkAuth, function(req, res) {
    if (!req.session.user_id) {
        return true;
    }else{
        return false;
    }
});

app.post('/login', function(req, res) {
    var post = req.body;
    console.log(post)
    if (post.username == 'john' && post.password == '123') {
        req.session.user_id = post.username +'_'+ post.password;
        res.send({success:true});
    } else {
        res.send({success:false});
    }
});

//app.set('dbConnection',dbConnection);
//console.log(dbConnection);
//console.log(dbConnection.bookshelf);
 
app.use('/products', productsRoutes);
app.use('/categories',categoriesRoutes);
app.use('/customers',customersRoutes);
app.use('/order',orderRoutes);


app.get('/logout', function(req, res) {
    delete req.session.user_id;
    res.redirect('/login');
});

module.exports = app;
