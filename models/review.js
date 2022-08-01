const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    image: String
});

module.exports = mongoose.model("Review", reviewSchema);