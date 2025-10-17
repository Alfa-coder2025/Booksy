//  /admin/products/create

//  /admin/products/delete

//  /admin/products/update

//  /admin/products/getAll

const express=require("express");
const router=express.Router();
const {upload,resizeImage}=require("../middlewares/upload");


const{addProduct,getAllProducts,updateProduct,deleteProduct}=require("../controllers/product.controller");
const {ensureAdmin}=require("../middlewares/authMiddleware");
router.use(ensureAdmin);
router.get('/getAll',getAllProducts);
router.put('/update/:id', upload.single('image'), resizeImage,updateProduct);
router.delete('/delete/:id',deleteProduct);
router.post('/add', upload.single('image'),resizeImage,addProduct);
console.log("Upload type:", typeof upload);
console.log("Keys:", Object.keys(upload));
router.get('/products/new',(req, res) => {
  res.render('adminaddproducts'); 
});
router.get('/editproducts/:id', (req, res) => {
  res.render('editproducts', {
    currentPage: 'editproducts',
    productId: req.params.id
  });
});



module.exports=router;