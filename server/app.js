var express = require('express');

var bodyParser = require('body-parser');
var expressSession = require('express-session');
var productsRoutes = require('./routes/products')
var categoriesRoutes = require('./routes/categories');
var customersRoutes = require('./routes/customers');
var orderRoutes = require('./routes/orders');
var config = require('./config');
var mongoose = require('mongoose');
var morgan = require('morgan');
var jwt = require('jsonwebtoken');
var async = require('async');
var app = express();
var apiRoutes = express.Router();

mongoose.connect(config.database);

app.set('superSecret', config.secret); // secret variable
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(express.static(__dirname + '../../client'));

var UserSchema = new mongoose.Schema({
    "user": String,
    'password': String
})

var User = mongoose.model('users', UserSchema);

app.post('/login', function(req, res) {
    var post = req.body;

    // find the user
    User.findOne({
        user: post.username
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
                    expiresInMinutes: 1440 // expires in 24 hours
                });

                // return the information including token as JSON
                res.status(200).json({
                    success: true,
                    message: 'Enjoy your token!',
                    token: token
                });
            }

        }

    });

});

// route middleware to verify a token
apiRoutes.use(function(req, res, next) {

    // check header or url parameters or post parameters for token
    var token = req.body.token || req.query.token || req.headers['x-access-token'];

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
});

var unless = function(path, middleware) {
    return function(req, res, next) {
        if (path === req.path) {
            return next();
        } else {
            return middleware(req, res, next);
        }
    };
};

app.use(unless('/setup', apiRoutes));//'/api', apiRoutes);


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

    async.parallel([dhiraj.save, mukesh.save], function(err, results) {
        if (err) throw err;
        res.json({
            success: true
        });
    });
});


//app.set('dbConnection',dbConnection);
//console.log(dbConnection);
//console.log(dbConnection.bookshelf);

app.use('/products', productsRoutes);
app.use('/categories', categoriesRoutes);
app.use('/customers', customersRoutes);
app.use('/orders', orderRoutes);


app.get('/logout', function(req, res) {
    delete req.session.user_id;
    res.redirect('/login');
});

module.exports = app;
