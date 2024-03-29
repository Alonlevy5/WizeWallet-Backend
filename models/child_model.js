const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    _id: {
      type: Number,
      required: true,
    },
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    img_url: {
      type: String,
    },
    tokens: {
      type: [String],
    },
    balance: {
      type: Number,
      default: 0,
    },
    transactions: [
      {
        description: String,
        amount: Number,
        longitude: String,
        latitude: String,
        createdat: String,
        istransact: Boolean,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Child", childSchema);
