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

// Routes
router.get('/getAll', auth, getAllOffers);          
router.get('/get/:id', auth, getOfferById);         
router.post('/add', auth, createOffer);          
router.post('/update/:id', auth, updateOffer);     
router.delete('/delete/:id', auth, deleteOffer);   

module.exports = router;
