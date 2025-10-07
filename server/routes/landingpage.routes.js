const express=require("express");
const router=express.Router();
const{getAllLandingPageContents}=require("../controllers/landingpage.controller");
const {upload,resizeImage}=require("../middlewares/upload");

router.get("/getLandingPageContents",getAllLandingPageContents);

module.exports=router;





