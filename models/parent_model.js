const mongoose = require("mongoose");

const parentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  tokens: {
    type: [String]
  },
  children: {
    type: [Number]
  }
});

module.exports = mongoose.model("Parent", parentSchema);