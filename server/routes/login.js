
var jwt = require('jsonwebtoken');
var mongoose = require('mongoose');
var config = require('./../config');

console.log(app)

var UserSchema = new mongoose.Schema({
    "user": String,
    'password': String
})

var User = mongoose.model('users', UserSchema);

exports.login = function(req, res) {
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
                console.log(app.get('superSecret'))
                var token = jwt.sign(user, app.get('superSecret'), {
                    expiresInMinutes: 1440 // expires in 24 hours
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
}

exports.userSetup = function(req, res) {

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
}