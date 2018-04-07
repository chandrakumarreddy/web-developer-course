const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Campground = require('./models/campground');
const seed = require('./seed');
/////////////////////////////////////////
///////////middleware
////////////////////////////////////////
mongoose.connect('mongodb://localhost/yelpcamp');
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json());
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
                campgrounds: campgrounds
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
            console.log(campground);
        }
    });
    res.redirect('/campgrounds');
});
app.get('/campgrounds/new', function(req, res) {
    res.render('campgrounds/new');
});
app.get('/campgrounds/:id', function(req, res) {
    Campground.findById(req.params.id, function(err, campground) {
        if (err) {
            console.log(err);
        } else {
            res.render('campgrounds/show', {
                campground: campground
            });
        }
    });
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