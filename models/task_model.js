const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema({
  //Refrence to KID ID IMPORTANT!!!
  kidid: {
    type: Number,
    required: true
  },
  message: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  sender: {
    type: String,
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
});

module.exports = mongoose.model("Task", taskSchema);
