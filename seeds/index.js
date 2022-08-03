const mongoose = require('mongoose');
const hotels = require('./hotels');
const Hotel = require('../models/hotel');
const Review = require('../models/review');

mongoose.connect('mongodb://localhost:27017/quarantine-hotel',{

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
            latitude: `${hotels[i].latitude}`, 
            longitude: `${hotels[i].longitude}`, 
            price: `${hotels[i].price}`,
            image: `${hotels[i].image}`
        });
        await quarantineHotel.save();
    }
}

seedDB().then(() => {
    mongoose.connection.close();
});