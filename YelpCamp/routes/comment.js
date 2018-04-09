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
router.get('/campgrounds/:id/comment/new', function(req, res) {
    res.render('comments/new', {
        id: req.params.id
    });
});
router.post('/campgrounds/:id/comment', function(req, res) {
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
router.get('/campgrounds/:id/comment/:comment_id/edit', isLoggedIn, function(req, res) {
    let campground_id = req.params.id;
    Comment.findById(req.params.comment_id, function(err, comment) {
        if (err) {
            console.log(err);
        } else {
            res.render('comments/edit', {
                campground_id: campground_id,
                comment: comment
            });
        }
    });
});
router.put('/campgrounds/:id/comment/:comment_id', function(req, res) {
    let campground_id = req.params.id;
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment) {
        if (err) {
            console.log(err);
            res.redirect('back');
        } else {
            res.redirect('/campgrounds/' + campground_id);
        }
    })
});
router.delete('/campgrounds/:id/comment/:comment_id', function(req, res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds' + req.params.id);
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