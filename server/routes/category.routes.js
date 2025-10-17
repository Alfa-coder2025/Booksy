const express = require('express');
const router = express.Router();
const {create,getAll,getById,addItem,deleteCategory,updateCategory} = require('../controllers/category.controller');
const {ensureAdmin,noCache}=require("../middlewares/authMiddleware");
const auth=require("../middlewares/authenticateToken");
const {upload,resizeImage}=require("../middlewares/upload");

router.use(noCache);
router.use(ensureAdmin);
router.get('/getAll',auth, getAll);
router.get('/get/:id',auth, getById); 
router.post('/update/:id', auth, upload.single('image'), updateCategory);
router.delete('/delete/:id',auth, deleteCategory);
router.post('/create',auth, upload.single('image'),resizeImage, create);




module.exports = router;