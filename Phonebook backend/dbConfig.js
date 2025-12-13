const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();

const mongoURL = process.env.MONGO_URI;

mongoose.connect(mongoURL)
.then(()=> console.log("Connected to database successfully"))
.catch(error => console.log("Error connecting to database", error));

module.exports = mongoose;