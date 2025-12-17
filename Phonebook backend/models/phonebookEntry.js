const mongoose = require("mongoose");

const entrySchema = new mongoose.Schema({
    name: {type: String, minLength: 3, required: true},
    number: {type: String, required: true}
});

const Entry = mongoose.model("Entry", entrySchema);

module.exports = Entry;
