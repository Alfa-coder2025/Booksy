const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String },
    phoneNumber: { type: Number },
    address: { type: String },
    district: { type: String },
    state: { type: String },
    landMark: { type: String },
    pincode: { type: Number },
    addressType: { type: String }, // e.g., 'Home', 'Work'
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
    },
    phoneNumber: {
      type: Number,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    address: {
      type: [addressSchema],
      default: [],
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Book", // Assuming a Book model exists
      },
    ],
    walletBalance: {
      type: Number,
      default: 0,
      min: 0,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "blocked"], // you can define your own statuses
      default: "active",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("User", userSchema);