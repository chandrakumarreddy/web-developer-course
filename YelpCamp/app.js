const express = require('express'),
    bodyParser = require('body-parser'),
    passport = require('passport'),
    mongoose = require('mongoose'),
    methodOverride = require('method-override'),
    LocalStrategy = require('passport-local').Strategy,
    expressSession = require('express-session'),
    passportLocalMongoose = require('passport-local-mongoose'),
    User = require('./models/user'),
    Campground = require('./models/campground'),
    Comment = require('./models/comment'),
    seed = require('./seed');
const campgroundRoutes = require('./routes/campground.js'),
    commentRoutes = require('./routes/comment.js'),
    indexRoutes = require('./routes/index.js');
/////////////////////////////////////////
///////////middleware
////////////////////////////////////////
let database = process.env.DATABASEURL || 'mongodb://localhost/yelpcamp';
mongoose.connect(database);
const app = express().use(bodyParser.urlencoded({
    extended: false
})).use(bodyParser.json()).set('view engine', 'ejs').use(methodOverride('_method')).use(express.static("public")).use(expressSession({
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
app.use(campgroundRoutes);
app.use(commentRoutes);
app.use(indexRoutes);
seed();
//////////////////////////////////////////
////routes
//////////////////////////////////////////
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