const mongoose = require('mongoose');
const hotels = require('./hotels');
const Hotel = require('../models/hotel');
const Review = require('../models/review');
const dbUrl = process.env.DB_URL ||'mongodb://localhost:27017/quarantine-hotel';
mongoose.connect(dbUrl,{

});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const seedDB = async () => {
    await Hotel.deleteMany({});
    await Review.deleteMany({});
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
        console.log(Hotel.find());
        await quarantineHotel.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});