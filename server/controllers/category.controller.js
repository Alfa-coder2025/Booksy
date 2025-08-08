const Category = require("../models/category.model");
const fs=require("fs");

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

// // 2. Get all categories
// const getAll = async (req, res) => {
//   try {
//     const categories = await Category.find();
//     res.json({ success: true, data: categories });
//   } catch (err) {
//     res.status(500).json({ success: false, error: "Server error" });
//   }
// };

// 2. Get all categories with sorting
const getAll = async (req, res) => {
  try {
    // Take sorting values from the query string (optional)
    const sortBy = req.query.sortBy || "name"; // default: sort by name
    const order = req.query.order === "desc" ? -1 : 1; // default: ascending

    // Find and sort
    const categories = await Category.find().sort({ [sortBy]: order });

    res.json({ success: true, data: categories });
  } catch (err) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};

module.exports = { getAll };


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
    console.log("result");
    const deleted = await Category.findByIdAndDelete(req.params.id);
    console.log(deleted);
    if (!deleted) {
      return res.status(404).json({ success: false, error: "Category not found" });
    }
    res.json({ success: true, message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


//update



const updateCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const { name, showOnHomepage } = req.body;

    const updateData = {
      name,
      showOnHomepage: showOnHomepage === 'on' || showOnHomepage === true || showOnHomepage === 'true'

    };

    if (req.file) {
      updateData.image = `/uploads/categories/${req.file.filename}`;

    }

    const updated = await Category.findByIdAndUpdate(categoryId, updateData, { new: true });
    console.log(updated);
   
    res.status(200).json({ message: 'Category updated successfully', data: updated ,success:true});
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating category' });
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
