var express = require('express');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var productsRoutes = require('./routes/products')
var app = express();

app.use(expressSession({
    secret: 'mySecretKey'
}));
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({
    extended: true
})); // for parsing application/x-www-form-urlencoded

app.use(express.static(__dirname + '../../client'));


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

app.use('/products', productsRoutes)

app.get('/logout', function(req, res) {
    delete req.session.user_id;
    res.redirect('/login');
});


module.exports = app;
