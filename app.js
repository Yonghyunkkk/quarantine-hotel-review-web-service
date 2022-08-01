const express = require('express');
const app = express();
const path = require('path');

const Hotel = require('./models/hotel');
const Review = require('./models/review');

const methodOverride = require('method-override');

const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');

mongoose.connect('mongodb://localhost:27017/quarantine-hotel',{

});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));
//hotel router
app.get('/', (req,res) => {
    res.render('home');
});

app.get('/hotels/:id/newReview', async(req,res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('reviews/new', { hotel });
});

app.post('/hotels/:id', async(req,res) => {
    console.log(req.body);
    const review = new Review(req.body.review);
    const hotel = await Hotel.findById(req.params.id);
    hotel.reviews.push(review);
    await review.save();
    await hotel.save();
    res.redirect(`/hotels/${hotel._id}`);
});

app.get('/hotels', async(req, res) => {
    const hotels = await Hotel.find({});
    res.render('hotels/index', { hotels }); // { hotels } allows db of hotels to be passed to index.ejs
});

app.get('/hotels/:id', async(req,res) => {
    const hotel = await Hotel.findById(req.params.id);
    res.render('hotels/show', { hotel }); // send the hotel with that id
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});