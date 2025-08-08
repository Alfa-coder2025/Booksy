const User=require("../models/user.model");

exports.getAllUsers = async (req, res) => {
  try {
    const sortField = req.query.sortBy || "name";
    const sortOrder = req.query.order === "desc" ? -1 : 1;
    const users = await User.find({ role: "user" }).sort({ [sortField]: sortOrder });

    res.json({ success: true, data: users });
  } catch (err) {
    res
      .status(500)
      .json({ success: false, message: "Error while loading the users" });
  }
};

exports.updateUsers=async(req,res)=>{
  try{
    const { status } = req.body;
    const userId = req.params.id;

  const user=await User.findById(userId);

  if (!user) return res.status(404).json({ success: false, message: "User not found" });
  user.status = status;
    await user.save();

    res.json({ success: true, message: `User ${user.status==="blocked" ? "blocked" : "Unblocked"}` });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error updating user" });
  }
}
