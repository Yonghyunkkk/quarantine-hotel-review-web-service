const Hotel = require('../models/hotel');
const Review = require('../models/review');


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
    review.author = req.user._id;
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash('success', 'Successfully uploaded a review!');
    res.redirect(`/hotels/${hotel._id}`);
}

module.exports.updateReview = async(req,res) => {
    const { id, reviewId } = req.params;
    const hotel = await Hotel.findById(id);
    const review = await Review.findByIdAndUpdate(reviewId, {...req.body.review});
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