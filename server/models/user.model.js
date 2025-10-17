const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    profilePic: { type: String, default: "" }, 
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
    username: {
      type: String,
    },
    phone: {
      type: Number,
      unique: true,
      sparse:true,
      default:null,
    },
     altPhone: {    
      type: Number,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      minlength: 4,
      required:false,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    googleId:{
      type:String,
      unique:true,
      sparse: true, 
    },
    profilePic: { type: String, default: "" },
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
      enum: ["active", "blocked"], // you can define your own statuses
      default: "active",
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);


module.exports = mongoose.model("User", userSchema);