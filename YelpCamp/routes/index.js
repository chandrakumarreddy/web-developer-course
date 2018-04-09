const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    router = express.Router(),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('../models/user'),
    Campground = require('../models/campground'),
    Comment = require('../models/comment');
router.get('/', function(req, res) {
    res.render('home');
});
router.get('/register', function(req, res) {
    res.render('register');
});
router.post('/register', function(req, res) {
    User.register(new User({
        username: req.body.username
    }), req.body.password, function(err, user) {
        if (err) {
            console.log(err);
            res.redirect('/login');
        } else {
            passport.authenticate("local")(req, res, function() {
                res.redirect('/campgrounds');
            });
        }
    });
});
router.get('/login', function(req, res) {
    res.render('login');
});
router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/campgrounds');
});
router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});
module.exports = router;