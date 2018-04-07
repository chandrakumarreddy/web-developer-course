const mongoose = require('mongoose');
const campgroundSchema = new mongoose.Schema({
    title: String,
    image: String,
    description: String
});
module.exports = mongoose.model('Campground', campgroundSchema);