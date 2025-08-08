const express = require('express');
const router = express.Router();
const {getAllUsers,updateUsers} = require('../controllers/users.controller');
const auth=require("../middlewares/authenticateToken");
const upload=require("../middlewares/upload");


router.get('/getAll',auth, getAllUsers);
router.put("/updateUsers/:id",auth, updateUsers);




module.exports = router;