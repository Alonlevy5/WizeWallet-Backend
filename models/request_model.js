const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({

    message: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    //KID ID AUTO DONE
    sender: {
        type: Number
    }
});

module.exports = mongoose.model("Request", requestSchema);
