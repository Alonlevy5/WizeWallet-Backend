const mongoose = require("mongoose");

const childSchema = new mongoose.Schema(
  {
    _id: String,
    unique: true,

    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    tokens: {
      type: [String],
    },
    balance: {
      type: Number,
      default: 0,
    },

    parents: {
      type: [String],
    },
    transactions: [
      {
        description: String,
        amount: Number,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Child", childSchema);
