const Hotel = require('../models/hotel');

module.exports.index = async(req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels }); // { hotels } allows db of hotels to be passed to index.ejs
}

module.exports.showHotel = async(req,res) => {
    const hotel = await Hotel.findById(req.params.id).populate({
        path: 'reviews',
        populate: {
            path: 'author'
        }}); //need to use populate so that we can get more than the id
    if(!hotel){
        req.flash('error', 'Cannot find that hotel!');
        return res.redirect('/hotels');
    }
    res.render('hotels/show', { hotel }); // send the hotel with that id
}