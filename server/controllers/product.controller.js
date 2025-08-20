const Book = require("../models/book.model"); // path to your Book schema

// Add Product
exports.addProduct = async (req, res) => {
  try {
     let productImage = '';
    if (req.file) {
      productImage = `/uploads/${req.file.filename}`; 
    }
    const productData = {
      ...req.body,
      images: productImage 
    };
    
    const product = new Book(productData); // take data from request body
    console.log(product);
    const savedProduct = await product.save();
    
    //IMAGE URL TO BE SAVED
    res.status(200).json({message:"added product successfully",success:true});
  } catch (error) {
    res.status(500).json({ message: "Error adding product", error });
  }
};

// Get All Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Book.find().populate("categoryId");
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Book.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedProduct) return res.status(404).json({ message: "Product not found" });
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({ message: "Error updating product", error });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Book.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

