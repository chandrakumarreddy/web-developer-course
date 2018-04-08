const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seed = require('./seed');
/////////////////////////////////////////
///////////middleware
////////////////////////////////////////
mongoose.connect('mongodb://localhost/yelpcamp');
const app = express().use(bodyParser.urlencoded({
    extended: false
})).use(bodyParser.json()).set('view engine', 'ejs').use(express.static("public")).use(expressSession({
    secret: 'soooosecret',
    resave: true,
    saveUninitialized: false
})).use(passport.initialize()).use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});
seed();
//////////////////////////////////////////
////routes
//////////////////////////////////////////
app.get('/', function(req, res) {
    res.render('home');
});
app.get('/campgrounds', function(req, res) {
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
app.post('/campgrounds', function(req, res) {
    let campground = {
        'title': req.body.title,
        'image': req.body.image,
        'description': req.body.description
    };
    Campground.create(campground, function(err, campground) {
        if (err) {
            console.log('error');
        } else {
            //console.log(campground);
        }
    });
    res.redirect('/campgrounds');
});
app.get('/campgrounds/new', isLoggedIn, function(req, res) {
    res.render('campgrounds/new');
});
app.get('/campgrounds/:id', isLoggedIn, function(req, res) {
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
app.get('/campgrounds/:id/comment/new', isLoggedIn, function(req, res) {
    res.render('comments/new', {
        id: req.params.id
    });
});
app.post('/campgrounds/:id/comment', isLoggedIn, function(req, res) {
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
                res.redirect('/campgrounds');
            });
        }
    });
});
app.get('/login', function(req, res) {
    res.render('login');
});
app.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/campgrounds');
});

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect('/login');
    }
}
app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/campgrounds');
});
app.get('*', function(req, res) {
    res.send('page not found');
});
//////////////////////////////////////////////////////////////////////
/////server connection
/////////////////////////////////////////////////////////////////////
app.listen(process.env.PORT || 3000, process.env.IP, function(err, res) {
    if (err) {
        console.log('unable to connect to port');
    } else {
        console.log('successfully connected');
    }
});