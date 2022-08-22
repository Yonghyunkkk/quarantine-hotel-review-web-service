const Hotel = require('../models/hotel');
const Review = require('../models/review');
const { cloudinary } = require('../cloudinary');

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken});

module.exports.renderNewReviewForm = async(req,res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('reviews/new', { hotel });
}

module.exports.renderEditReviewForm = async(req,res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = await Review.findById(req.params.reviewId);
    if(!review){
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    res.render('reviews/edit', { hotel, review });
}

module.exports.createReview = async(req,res) => {
    const review = new Review(req.body.review);
    const hotel = await Hotel.findById(req.params.id);
    let today = new Date();

    review.images = req.files.map( f => ({ url: f.path, filename: f.filename }));
    review.author = req.user._id;
    review.date = today.toLocaleDateString();

    hotel.reviews.push(review);
    hotel.total += review.rating;
    hotel.average = Math.round((hotel.total / hotel.reviews.length) * 10) / 10;

    if (review.rating === 1){
        hotel.one += 1;
    } else if (review.rating === 2){
        hotel.two += 1;
    } else if (review.rating === 3){
        hotel.three += 1;
    } else if (review.rating === 4){
        hotel.four += 1;
    } else if (review.rating === 5){
        hotel.five += 1;
    }

    console.log(hotel);
    await review.save();
    await hotel.save();
    req.flash('success', 'Successfully uploaded a review!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.updateReview = async(req,res) => {
    const { id, reviewId } = req.params;
    const hotel = await Hotel.findById(id);
    const review = await Review.findByIdAndUpdate(reviewId, {...req.body.review});
    const imgs = req.files.map( f => ({ url: f.path, filename: f.filename }));
    review.images.push(...imgs);
    await review.save();
    if (req.body.deleteImages){
        for (let filename of req.body.deleteImages){
            await cloudinary.uploader.destroy(filename);
        }
        await review.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages}}}});
        console.log(review);
    }
    req.flash('success', 'Successfully updated a review!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.deleteReview = async(req, res) => {
    const { id, reviewId } = req.params;
    const hotel = await Hotel.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Hotel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/hotels/${hotel._id}`);
}