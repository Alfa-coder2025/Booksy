const express = require("express");
const router = express.Router();

const{getAllAddress,addAddress,updateAddress,deleteAddress}=require("../controllers/addressbook.controller");

router.get("/getAll",getAllAddress);
router.post("/",addAddress);
router.put("/:id",updateAddress);  
router.delete("/:id",deleteAddress);

module.exports=router;