const mongoose = require("mongoose");
const dotenv = require("dotenv").config();

async function com (cb) {
    try {
        let db = await mongoose.connect(process.env.MONGODB_URL); // is a promise
        // console.log(db.STATES.connected);
        if(db.STATES.connected == 1) {
        console.log("connection to Db was successful");
        cb(); // app.listen in our app.js
        } else {
        }
    } catch (err) {
        // console.log(err.cause.code);
        console.log("connection to Db was not successful")
    }
}

module.exports=com;