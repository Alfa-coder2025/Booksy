const express = require('express');
const router = express.Router();
const {
  createOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
  deleteOffer
} = require('../controllers/offer.controller');

const auth = require("../middlewares/authenticateToken");
const {ensureAdmin}=require("../middlewares/authMiddleware");
router.use(ensureAdmin);


// Routes
router.get('/getAll',getAllOffers);          
router.get('/get/:id', getOfferById);         
router.post('/add', createOffer);          
router.post('/update/:id', updateOffer);     
router.delete('/delete/:id',deleteOffer);   

module.exports = router;
