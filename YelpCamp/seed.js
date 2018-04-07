const mongoose = require('mongoose');
const Campground = require('./models/campground');
let data = [{
    title: 'campground-01',
    image: "https://cdn.pixabay.com/photo/2017/08/04/20/04/camping-2581242_960_720.jpg",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim eos qui architecto tempore omnis deleniti tenetur reprehenderit eum, itaque odit cumque quisquam ex sit, ullam ipsum voluptatibus sapiente nobis ratione.'
}, {
    title: 'campground-02',
    image: "https://pixabay.com/get/ea37b70d21f0003ed1584d05fb1d4e97e07ee3d21cac104497f3c079a0e5b0b9_340.jpg",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim eos qui architecto tempore omnis deleniti tenetur reprehenderit eum, itaque odit cumque quisquam ex sit, ullam ipsum voluptatibus sapiente nobis ratione.'
}, {
    title: 'campground-03',
    image: "https://farm1.staticflickr.com/130/321487195_ff34bde2f5.jpg",
    description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Enim eos qui architecto tempore omnis deleniti tenetur reprehenderit eum, itaque odit cumque quisquam ex sit, ullam ipsum voluptatibus sapiente nobis ratione.'
}];

function seed() {
    Campground.remove({}, function(err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            data.forEach(function(e) {
                Campground.create(e);
            });
        }
    });
}
module.exports = seed;