if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');

const hotels = require('./hotels');
const Hotel = require('./models/hotel');
const Review = require('./models/review');

const methodOverride = require('method-override');

const mongoose = require('mongoose');

const ejsMate = require('ejs-mate');

const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/ExpressError');
const reviewSchema = require('./schemas.js');

const hotelRoutes = require('./routes/hotels');
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

const session = require('express-session');
const flash = require('connect-flash');

const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/quarantine-hotel';

const MongoStore = require('connect-mongo');

mongoose.connect(dbUrl,{

});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.engine('ejs', ejsMate);
app.set('view engine','ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

const secret = process.env.SECRET || 'thisshouldbesecret!';


const seedDB = async () => {
    for (let i = 0; i < hotels.length; i++) {
        const quarantineHotel = new Hotel({
            title: `${hotels[i].title}`,
            district: `${hotels[i].district}`, 
            address: `${hotels[i].address}`,
            geometry: {
                type: "Point",
                coordinates: [`${hotels[i].longitude}`,`${hotels[i].latitude}`]
            },
            latitude: `${hotels[i].latitude}`, 
            longitude: `${hotels[i].longitude}`, 
            price: `${hotels[i].price}`,
            image: `${hotels[i].image}`,
            link: `${hotels[i].link}`,
            total: 0,
            average: 0,
            five: 0,
            four: 0,
            three: 0,
            two: 0,
            one: 0
        });
        await quarantineHotel.save();
    }
}


seedDB().then(() => {
});


const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});

store.on("error", function(e) {
    console.log("Session store error",e);
});

const sessionConfig = {
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash()); 

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;  //ejs files all have access to currentUser success, and error
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.use('/hotels', hotelRoutes);
app.use('/hotels/:id', reviewRoutes);
app.use('/', userRoutes);

app.use(express.static(path.join(__dirname, 'public')));

//hotel router
app.get('/', (req,res) => {
    res.render('home');
});


app.all('*', (req,res,next) => {
    next(new ExpressError('Page Not Found', 404));
});

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
});