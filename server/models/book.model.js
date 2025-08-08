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
    regularPrice: { type: mongoose.Schema.Types.Double },
    publisher: { type: String },
    categoryId: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    language: { type: String },
    coverType: { type: String },
    images: { type: [mongoose.Schema.Types.Mixed], default: [] },
    stockQuantity: { type: mongoose.Schema.Types.Int32 },
    rating: { type: mongoose.Schema.Types.Int32 },
    showAsTopSelling: { type: Boolean, default: false },
    showAsLatest: { type: Boolean, default: false },
    offer: { type: String },
    salePrice: { type: mongoose.Schema.Types.Double },
    totalPage: { type: mongoose.Schema.Types.Long },
    publishedDate: { type: Date },
    cardDescription: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }, 
  },
  {
    collection: "Books"
  }
);


module.exports = mongoose.model("Book", bookSchema);
