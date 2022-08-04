const express = require('express');
const router =  express.Router({mergeParams: true}); // need this in order to access hotel's :id
const reviews = require('../controllers/reviews');

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn, isReviewAuthor, validateReview } = require('../middleware'); 


router.get('/newReview', isLoggedIn, catchAsync(reviews.renderNewReviewForm));

router.get('/editReview/:reviewId', isLoggedIn, catchAsync(reviews.renderEditReviewForm));

router.post('/', isLoggedIn, validateReview, catchAsync(reviews.createReview));

router.put('/editReview/:reviewId', isLoggedIn, validateReview, isReviewAuthor, catchAsync(reviews.updateReview));

router.delete('/deleteReview/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviews.deleteReview));

module.exports = router;