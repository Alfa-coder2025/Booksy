const Book = require("../models/book.model"); // path to your Book schema

// Add Product
exports.addProduct = async (req, res) => {
  try {
    console.log(req.file.filename);
     let productImage = '';
     let imagesArr=[];
    if (req.file) {
      productImage = `/uploads/${req.file.filename}`; 
      imagesArr.push(productImage);
    }

    const showAsTopSelling = req.body.showAsTopSelling === "true";
const showAsLatest = req.body.showAsLatest === "true" ;


    const productData = {
      ...req.body,
      images: imagesArr,
      showAsTopSelling,
      showAsLatest
    };
    
    const product = new Book(productData); // take data from request body
    console.log(product,"text-adding-product");
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
    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "asc" ? 1 : -1; // asc = 1, desc = -1

    const products = await Book.find().populate("categoryId").sort({ [sortBy]: order });
  
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products", error });
  }
};


// Update Product
exports.updateProduct = async (req, res) => {
  try {
    console.log("Update Params:", req.params);
    console.log("Update Body:", req.body);
    console.log("Update File:", req.file);

    const productId = req.params.id;

    const showAsTopSelling = req.body.showAsTopSelling === "true";
const showAsLatest = req.body.showAsLatest === "true";


      const updateData = {
      bookName: req.body.bookName,
      author: req.body.author,
      description: req.body.description,
      regularPrice: req.body.regularPrice,
      salePrice: req.body.salePrice,
      stockQuantity: req.body.stockQuantity,
      offer: req.body.offer,
      categoryId: req.body.categoryId,
      showAsTopSelling,
      showAsLatest,
    };


    // If a new file is uploaded, update the cover image too
    if (req.file) {
      updateData.images = [`/uploads/${req.file.filename}`];;
    }
    else {
      // No new file → keep existing image(s)
      const existingProduct = await Book.findById(productId).select("images");
      if (existingProduct) {
        updateData.images = existingProduct.images;
      }
    }

    const updatedProduct = await Book.findByIdAndUpdate(productId, updateData, {
      new: true,
    });

    if (!updatedProduct) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }

    res.json({ success: true, product: updatedProduct });
  } catch (error) {
    console.error("Update error:", error);
    res.status(500).json({ success: false, message: "Error updating product", error });
  }
};


// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Book.findByIdAndDelete(req.params.id);
    if (!deletedProduct) return res.status(404).json({ message: "Product not found" });
    res.json({ message: "Product deleted successfully" ,success:true});
  } catch (error) {
    res.status(500).json({ message: "Error deleting product", error });
  }
};

