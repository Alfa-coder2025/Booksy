const User = require("../models/user.model");

// Controller function to get all users
const getAllUsers = async (req, res) => {
  try {
    
    const users = await User.find({}, { password: 0 });

    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error.message);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

module.exports = { getAllUsers };
