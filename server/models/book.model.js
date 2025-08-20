const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    about: { type: String },
    name: { type: String }
  },
  { _id: false } // embed without its own _id
);

const bookSchema = new mongoose.Schema(
  {
    bookName: { type: String, required: true },
    author: { type: authorSchema },
    description: { type: String },
    regularPrice: { type: Number },
    publisher: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    language: { type: String },
    coverType: { type: String },
    images: { type: [String], default: [] },
    stockQuantity: { type: mongoose.Schema.Types.Int32 },
    rating: { type: Number, min: 0, max: 5 },
    showAsTopSelling: { type: Boolean, default: false },
    showAsLatest: { type: Boolean, default: false },
    offer: { type: String },
    salePrice: { type: Number },
    totalPage: { type: Number },
    publishedDate: { type: Date },
    cardDescription: { type: String }
  },
  {
    collection: "Books",
    timestamps: true 
  }
);


module.exports = mongoose.model("Book", bookSchema);
