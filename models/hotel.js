const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const HotelSchema = new Schema({
    title: String,
    district: String,
    address: String,
    latitude: Number,
    longitude: Number,
    price: Number,
    image: String,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
});

module.exports = mongoose.model('Hotel', HotelSchema);