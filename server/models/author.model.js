const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    description: {
      type: String,
      trim: true
    },
    image: {
    type: String,
    default: ""
}

  },
  {
    timestamps: { createdAt: true, updatedAt: false } // only createdAt
  }
);

module.exports = mongoose.model("Author", authorSchema);
