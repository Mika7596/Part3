const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    name: String,
    number: String
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
