const express = require('express');
const router =  express.Router({mergeParams: true}); // need this in order to access campground's :id

const Hotel = require('../models/hotel');
const Review = require('../models/review');

const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schemas.js');

const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware'); 


router.get('/newReview', isLoggedIn, catchAsync(async(req,res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('reviews/new', { hotel });
}));

router.get('/editReview/:reviewId', isLoggedIn, catchAsync(async(req,res) => {
    const hotel = await Hotel.findById(req.params.id);
    const review = await Review.findById(req.params.reviewId);
    if(!review){
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    res.render('reviews/edit', { hotel, review });
}));

router.post('/', isLoggedIn, validateReview, catchAsync(async(req,res) => {
    const review = new Review(req.body.review);
    const hotel = await Hotel.findById(req.params.id);
    review.author = req.user._id;
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    req.flash('success', 'Successfully uploaded a review!');
    res.redirect(`/hotels/${hotel._id}`);
}));


router.put('/editReview/:reviewId', isLoggedIn, validateReview, isReviewAuthor, catchAsync(async(req,res) => {
    const { id, reviewId } = req.params;
    const hotel = await Hotel.findById(id);
    const review = await Review.findByIdAndUpdate(reviewId, {...req.body.review});
    req.flash('success', 'Successfully updated a review!');
    res.redirect(`/hotels/${hotel._id}`);
}));

router.delete('/deleteReview/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(async(req, res) => {
    const { id, reviewId } = req.params;
    const hotel = await Hotel.findById(id);
    await Review.findByIdAndDelete(reviewId);
    await Hotel.findByIdAndUpdate(id, {$pull: {reviews: reviewId}});
    req.flash('success', 'Successfully deleted a review!');
    res.redirect(`/hotels/${hotel._id}`);
}));

module.exports = router;