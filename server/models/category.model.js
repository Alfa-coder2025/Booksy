const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema(
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
    showOnHomepage: {
      type: Boolean,
      default: false
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

module.exports = mongoose.model("Category", categorySchema);
