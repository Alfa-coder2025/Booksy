const express = require("express");
const router = express.Router();
const { getAllUsers,adminLogout } = require("../controllers/admin.controller");
const {ensureAdmin,ensureAuthenticated,noCache}=require("../middlewares/authMiddleware");


router.use(noCache);

router.get("/admin-users",ensureAdmin,getAllUsers);
router.get("/admin-logout",ensureAdmin,adminLogout);
// Dashboard route 
router.get("/admindashboard",ensureAdmin,(req, res) => {
  res.render("admindashboard", {
    currentPage: "dashboard",
    user: req.session.user,
  });
});




module.exports = router;
