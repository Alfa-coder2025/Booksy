const express=require("express");
const router=express.Router();
const {upload,resizeImage}=require("../middlewares/upload");

const {getUserAccount,uploadProfilePic,updateUserProfile}=require("../controllers/user.controller");
const{ensureAuthenticated}=require("../middlewares/authMiddleware");
router.get("/mydetails",ensureAuthenticated,getUserAccount);
router.post("/upload-profile-pic",upload.single("profilePic"),resizeImage,uploadProfilePic);
router.post("/update-profile",ensureAuthenticated,updateUserProfile);

module.exports=router;