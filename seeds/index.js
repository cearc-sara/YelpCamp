const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities')
const {places, descriptors} = require('./seedHelpers');
const axios = require('axios');

mongoose.connect('mongodb://localhost:27017/yelp-camp', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected")
});

const seedImg = async () => {
    try{
        const resp = await axios.get('https://api.unsplash.com/photos/random', {
            params: {
                client_id: 'x7JTgzqELG172ACeSa2mex3oDkz4h2sFx2uhZneliEg',
                collections: '483251' 
            },
        })
        return resp.data.urls.small
    }catch (err){
        console.log(err)
    }
};

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 3; i++){
       const random1000 = Math.floor(Math.random() * 1000);
       const price = Math.floor(Math.random() * 20) + 10;

        const camp = new Campground({
            image: await seedImg(),
            title: `${sample(descriptors)} ${sample(places)}`,
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Debitis, nihil tempora vel aspernatur quod aliquam illum! Iste impedit odio esse neque veniam molestiae eligendi commodi minus, beatae accusantium, doloribus quo!',
            price
        })
        await camp.save();
    }
};

seedDB().then(() => {
    mongoose.connection.close();
});