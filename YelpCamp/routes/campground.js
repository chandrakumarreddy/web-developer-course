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
router.get('/campgrounds', function(req, res) {
    Campground.find({}, function(err, campgrounds) {
        if (err) {
            console.log('cannot find campgrounds');
        } else {
            res.render('campgrounds/index', {
                campgrounds: campgrounds,
            });
        }
    });
});
router.post('/campgrounds', function(req, res) {
    let campground = {
        'title': req.body.title,
        'image': req.body.image,
        'description': req.body.description
    };
    Campground.create(campground, function(err, campground) {
        if (err) {
            console.log('error');
        } else {
            campground.author.id = req.user._id;
            campground.author.username = req.user.username;
            campground.save();
        }
    });
    res.redirect('/campgrounds');
});
router.get('/campgrounds/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});
router.get('/campgrounds/:id', isLoggedIn, function(req, res) {
    console.log(req.params.id);
    Campground.findById(req.params.id).populate('comments').exec(function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {
                campground: campground
            });
        }
    });
});
router.get('/campgrounds/:id/edit', checkOwnerShip, function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            res.redirect("back");
        } else {
            res.render('campgrounds/edit', {
                campground: campground
            });
        }
    });
});
router.put('/campgrounds/:id', function(req, res) {
    let data = {
        title: req.body.title,
        image: req.body.image,
        description: req.body.description
    };
    Campground.findByIdAndUpdate(req.params.id, data, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});
router.delete('/campgrounds/:id', checkOwnerShip, function(req, res) {
    Campground.findByIdAndRemove(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/campgrounds');
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

function checkOwnerShip(req, res, next) {
    if (req.isAuthenticated()) {
        Campground.findById(req.params.id, function(err, campground) {
            if ((campground.author.id).equals(req.user._id)) {
                next();
            } else {
                res.redirect('back');
            }
        });
    } else {
        res.redirect('back');
    }
}
module.exports = router;