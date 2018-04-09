const express = require('express'),
    bodyParser = require('body-parser'),
    router = express.Router(),
    passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('../models/user'),
    Campground = require('../models/campground'),
    Comment = require('../models/comment');
router.get('/campgrounds/:id/comment/new', isLoggedIn, function(req, res) {
    res.render('comments/new', {
        id: req.params.id
    });
});
router.post('/campgrounds/:id/comment', isLoggedIn, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            Comment.create({
                author: req.body.author,
                comment: req.body.comment
            }, function(err, comment) {
                if (err) {
                    console.log(err);
                } else {
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    comment.save();
                    campground.comments.push(comment);
                    campground.save(function(err, campgrounds) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.redirect('/campgrounds/' + req.params.id);
                        }
                    });
                }
            })
        }
    });
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/login');
    }
}
module.exports = router;