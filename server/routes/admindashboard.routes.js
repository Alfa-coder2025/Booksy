const express=require("express");
const router=express.Router();
const{ensureAdmin}=require("../middlewares/authMiddleware");
const{getAdminDashboard}=require("../controllers/admindashboard.controller");

router.get("/getAdminDashboard-details",ensureAdmin,getAdminDashboard);

module.exports=router;