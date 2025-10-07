
const Offer = require("../models/offer.model");

//Create Offer
exports.createOffer = async (req, res) => {
  try {
    const { title,minimumorderValue, discountValue, description, usageLimit, expiryDate } = req.body;

    const offer = new Offer({
      title,
      minimumorderValue: minOrderValue,
      discountValue,
      description,
      usageLimit,
      expiryDate: endDate
    });

    await offer.save();
    res.redirect("/admin-offermanagement");  // Redirect back to offer page
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating offer");
  }
};

// Get all offers
exports.getAllOffers = async (req, res) => {
  try {
    const offers = await Offer.find();
    res.render("offermanagement",{ currentPage: "offermanagement"}, { offers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching offers");
  }
};

// Get single offer by ID
exports.getOfferById = async (req, res) => {
  try {
    const offer = await Offer.findById(req.params.id);
    if (!offer) {
      return res.status(404).send("Offer not found");
    }
    res.render("offerDetails", { offer }); // Or send JSON if you want
  } catch (error) {
    console.error(error);
    res.status(500).send("Error fetching offer");
  }
};

// Update offer
exports.updateOffer = async (req, res) => {
  try {
    const { title,minimumorderValue, discountValue, description, usageLimit, expiryDate } = req.body;

    await Offer.findByIdAndUpdate(req.params.id, {
      title,
      minimumorderValue: minOrderValue,
      discountValue,
      description,
      usageLimit,
      expiryDate: endDate
    });

    res.redirect("/admin-offermanagement");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error updating offer");
  }
};

// Delete offer
exports.deleteOffer = async (req, res) => {
  try {
    await Offer.findByIdAndDelete(req.params.id);
    res.redirect("/admin-offermanagement");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error deleting offer");
  }
};
