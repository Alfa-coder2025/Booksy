const Category = require("../models/category.model");

// 1. Create category
const create = async (req, res) => {

  try {
    let imagePath = '';
    if (req.file) {
      imagePath = `/uploads/categories/${req.file.filename}`; // relative path
    }

    const category = await Category.create({ name: req.body.name,showOnHomepage:req.body.showOnHomepage,image:imagePath});
    res.json({ success: true, data:category });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 2. Get all categories
const getAll = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

// 3. Get single category by ID (NEW)
const getById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, error: "Invalid ID format" });
  }
};

// 4. Add item to category-edit API
const addItem = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    category.items.push(req.body.itemName);
    await category.save();
    res.json({ success: true, data: category });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// 5. Delete category
const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


//update

const updateCategory = async (req, res) => {
  try {
    console.log("result");
    const updateData = {
      name: req.body.name
    };

    if (req.file) {
      updateData.image = req.file.filename;
    }

    const updated = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updated) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};


module.exports = {
  create,
  getAll,
  getById,
  addItem,
  deleteCategory,
  updateCategory
};
