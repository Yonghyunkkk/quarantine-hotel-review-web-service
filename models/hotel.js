const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Review = require('./review');

const opts = { toJSON: { virtuals: true } };

const HotelSchema = new Schema({
    title: String,
    district: String,
    address: String,
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    price: Number,
    image: String,
    link: String,
    total: Number,
    average: Number,
    five: Number,
    four: Number,
    three: Number,
    two: Number,
    one: Number,
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
}, opts);

HotelSchema.virtual('properties.popUpMarkup').get(function () {
    return `
    <strong><a href="/hotels/${this._id}">${this.title}</a><strong>
    <p style="color: black">${this.address}</p>
    <p style="color: black">Minimum Price 1Pax: ${this.price}</p>`
});

module.exports = mongoose.model('Hotel', HotelSchema);