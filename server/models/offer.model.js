const mongoose = require("mongoose");

// Offer Schema
const offerSchema = new mongoose.Schema({
  minimumorderValue: {
    type: String,   
    default: "Not Applicable"
  },
  discountValue: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  usageLimit: {
    type: Number,
    default: 1
  },
  expiryDate: {
    type: Date,
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model("Offer", offerSchema);
