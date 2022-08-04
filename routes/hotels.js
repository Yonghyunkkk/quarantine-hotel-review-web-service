const express = require('express');
const router =  express.Router();
const hotels = require('../controllers/hotels');

const catchAsync = require('../utils/catchAsync');


router.get('/', catchAsync(hotels.index));

router.get('/:id', catchAsync(hotels.showHotel));

module.exports = router;