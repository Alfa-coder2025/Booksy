const Author=require("../models/author.model");

const getAllAuthors = async (req, res) => {
  try {
    const authors = await Author.find({}).sort({ name: 1 });
    res.json({ success: true, data: authors });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch authors" });
  }
};

module.exports = { getAllAuthors };