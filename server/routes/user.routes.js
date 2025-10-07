const express=require("express");
const router=express.Router();
const {upload,resizeImage}=require("../middlewares/upload");

const {getUserAccount,uploadProfilePic}=require("../controllers/user.controller");
router.get("/mydetails",getUserAccount);
router.post("/upload-profile-pic", upload.single("profilePic"), resizeImage,uploadProfilePic);

module.exports=router;