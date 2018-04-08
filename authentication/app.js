const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user');
///////////////////
////middleware
///////////////////
mongoose.connect("mongodb://localhost/test")
const app = express().use(bodyParser.urlencoded({
    extended: false
})).use(bodyParser.json()).set('view engine', 'ejs').use(express.static("views")).use(expressSession({
    secret: 'soooosecret',
    resave: true,
    saveUninitialized: false
})).use(passport.initialize()).use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
///////////////////////////////
///express routes
//////////////////////////////
app.get('/', function(req, res) {
    res.render("home");
});
app.get('/register', function(req, res) {
    res.render('register');
});
app.post('/register', function(req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect('/secret');
            });
        }
    });
});
app.get('/login', function(req, res) {
    res.render('login');
});
app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/secret');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        console.log("not authenticated");
        res.redirect('/login');
    }
}
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});
app.get('/secret', isLoggedIn, function(req, res) {
    res.render("secret");
});
//////////////////////////////////
///listening to connection
///////////////////////////////
app.listen(process.env.PORT || 3000, process.env.IP, function(err, res) {
    if (err) {
        console.log(err);
    } else {
        console.log("connected");
    }
});