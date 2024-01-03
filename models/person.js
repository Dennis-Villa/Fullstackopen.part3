const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const logger = require("../utils/logger");
const config = require("../utils/config");

const url = config.MONGODB_URI;

("connecting to", url);

mongoose.connect(url)
    .then(() => {
        logger.info("connected to MongoDB");
    })
    .catch((error) => {
        logger.info("error connecting to MongoDB:", error.message);
    });

const personSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true, minlength: 3 },
    number: { type: String, minlength: 8 },
});

personSchema.set("toJSON", {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
});

personSchema.plugin(uniqueValidator);

module.exports = mongoose.model("Person", personSchema);