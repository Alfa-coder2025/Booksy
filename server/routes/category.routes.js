const express = require('express');
const router = express.Router();
const {create,getAll,getById,addItem,deleteCategory,updateCategory} = require('../controllers/category.controller');
const auth=require("../middlewares/authenticateToken");
const {upload,resizeImage}=require("../middlewares/upload");


router.get('/getAll',auth, getAll);
router.get('/get/:id',auth, getById); 
router.post('/update/:id', auth, upload.single('image'), updateCategory);
router.delete('/delete/:id',auth, deleteCategory);
router.post('/create',auth, upload.single('image'),resizeImage, create);




module.exports = router;