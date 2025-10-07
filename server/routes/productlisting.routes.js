const express=require("express");
const router=express.Router();

const {getAllProductListingContents,getproductafterFilterandSort}=require("../controllers/productlisting.controller");


const {upload,resizeImage}=require("../middlewares/upload");

router.get("/getAllProductListingContents",getAllProductListingContents);
router.get("/getAllFilteredProducts",getproductafterFilterandSort);



module.exports=router; 