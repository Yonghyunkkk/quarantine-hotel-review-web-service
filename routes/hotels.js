const express = require('express');
const router =  express.Router();

const Hotel = require('../models/hotel');

const catchAsync = require('../utils/catchAsync');

const { isLoggedIn } = require('../middleware'); 


router.get('/', catchAsync(async(req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels }); // { hotels } allows db of hotels to be passed to index.ejs
}));

router.get('/:id', catchAsync(async(req,res) => {
    const hotel = await Hotel.findById(req.params.id).populate('reviews'); //need to use populate so that we can get more than the id
    if(!hotel){
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    res.render('hotels/show', { hotel }); // send the hotel with that id
}));

module.exports = router;