var express = require('express');

var bodyParser = require('body-parser');
var path = require('path')

var productsRoutes = require('./routes/products')
var categoriesRoutes = require('./routes/categories');
var customersRoutes = require('./routes/customers');
var orderRoutes = require('./routes/orders');
var transactionRoutes = require('./routes/transactions');
var config = require('./config');
require('./mongoose-connect');
var mongoose = require('mongoose');


var jwt = require('jsonwebtoken');
var async = require('async');
var app = express();

app.set('superSecret', config.secret); // secret variable
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(express.static(path.resolve(__dirname, '../client')))

var UserSchema = new mongoose.Schema({
    "user": String,
    'password': String
})

var User = mongoose.model('users', UserSchema);

app.post('/login', function(req, res) {
    var post = req.body;

    // find the user
    User.findOne({
        user: post.username.toLowerCase()
    }, function(err, user) {

        if (err) throw err;

        if (!user) {
            res.status(401).json({
                success: false,
                message: 'Authentication failed. User not found.'
            });
        } else if (user) {

            // check if password matches
            if (user.password != post.password) {
                res.status(401).json({
                    success: false,
                    message: 'Authentication failed. Wrong password.'
                });
            } else {

                // if user is found and password is right
                // create a token
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresIn: 86400 // expires in 24 hours
                });

                // return the information including token as JSON
                res.status(200).json({
                    success: true,
                    message: 'Enjoy your token!',
                    defaultCategoryID: 2,
                    token: token
                });
            }

        }

    });

});


// route middleware to verify a token
function isLoggedIn(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.headers['Authorization'] || req.headers['authorization'];

    token = token.split('Bearer ')[1]
    // decode token
    if (token) {
        // verifies secret and checks exp
        jwt.verify(token, app.get('superSecret'), function(err, decoded) {
            if (err) {
                return res.status(401).json({
                    success: false,
                    message: 'Failed to authenticate token.'
                });
            } else {
                // if everything is good, save to request for use in other routes
                req.decoded = decoded;
                next();
            }
        });

    } else {
        // if there is no token
        // return an error
        return res.status(401).send({
            success: false,
            message: 'No token provided.'
        });

    }
}

var unless = function(path, middleware) {
    return function(req, res, next) {
        
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};


app.get('/setup', function(req, res) {

    var dhiraj = new User({
        user: 'dhiraj',
        password: 'dg1111',
        admin: true
    });

    var mukesh = new User({
        user: 'mukesh',
        password: 'mg1111',
        admin: true
    });

    var himmat = new User({
        user: 'himmat',
        password: 'hs1111',
        admin: true
    });

    async.parallel([dhiraj.save, mukesh.save, himmat.save], function(err, results) {
        if (err) throw err;
        res.json({
            success: true
        });
    });
});


app.use('/products', isLoggedIn, productsRoutes);
app.use('/categories', isLoggedIn, categoriesRoutes);
app.use('/customers', isLoggedIn, customersRoutes);
app.use('/orders', isLoggedIn, orderRoutes);
app.use('/transactions', isLoggedIn, transactionRoutes);


app.get('/logout', function(req, res) {
    delete req.session.user_id;
    res.redirect('/login');
});

module.exports = app;
