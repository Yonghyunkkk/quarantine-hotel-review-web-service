const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_300');
});

ImageSchema.virtual('thumbnail2').get(function () {
    return this.url.replace('/upload', '/upload/w_1400');
});

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    images: [ImageSchema],
    date: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

module.exports = mongoose.model("Review", reviewSchema);