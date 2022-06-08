const mongoose = require("mongoose");

const requestSchema = new mongoose.Schema({
  message: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  //KID ID AUTO DONE
  sender: {
    type: Number,
  },
  createdat: {
    type: String,
  },
});

module.exports = mongoose.model("Request", requestSchema);
