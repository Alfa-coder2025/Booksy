const express=require("express");
const router=express.Router();

const{getProductsInfo,getRelatedProducts}=require("../controllers/productsview.controller.js");

router.get("/related",getRelatedProducts);
router.get("/:id",getProductsInfo);


module.exports=router;