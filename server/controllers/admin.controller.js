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

const adminLogout=async(req,res)=>{
  try {
   
      req.session.destroy(err=>{
        if(err){
          console.log("Error destroying ssion",err);
           res.status(500).json({ message: "Something went wrong!" });
        }
            res.clearCookie("connect.sid");
        res.redirect("/login");
      })
      
    }
  catch (error) {
    console.log("Unexpected error",error);
  }
}


module.exports = { getAllUsers,adminLogout };
