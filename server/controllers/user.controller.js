const User=require("../models/user.model");
const Order=require("../models/order.model");

const getUserAccount=async(req,res)=>{
try{
  console.log("Session in /mydetails:", req.session.user);
const userId=req.session?.user?.id||req.user?.id;
if(!userId){
  return res.status(401).json({success:false,message:"User not identified"});
}
const user=await User.findById(userId).lean();//lean();gives plane js object
if(!user){
  return res.status(404).json({success:false,message:"User details not found"});
}

//orderCount
const orderCount=await Order.countDocuments({userId});
//wishListCount
const wishListCount=user.wishlist?.length||0;

if (user.profilePic) {
      user.profilePic = `${req.protocol}://${req.get("host")}${user.profilePic}`;
    }

res.json({success:true,
  data:user,orderCount,wishListCount

});
}
catch(error){
  res.status(500).json({success:false,message:"Server error",error:error.message});
}

}

const uploadProfilePic=async(req,res)=>{
  try{
    const userId=req.session?.user?.id||req.user?.id;
if(!userId){
  return res.status(401).json({success:false,message:"User not found"});
}
if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
// const user=await User.findById(userId);
// user.profilePic=`/uploads/profilePic/${req.file.filename}`;

const filePath = `/uploads/${req.file.filename}`;

 const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: filePath },
      { new: true }
    );
 req.session.user = updatedUser;
res.json({ success: true, message: "Profile picture updated", profilePic: `${req.protocol}://${req.get("host")}${filePath}` });
  }
  catch(error){
    res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

const updateUserProfile=async(req,res)=>{
  try {
    const userId=req.session?.user?.id||req.user?.id;
    if(!userId){
  return res.status(401).json({success:false,message:"User not found"});
}
const {username,phone,altPhone,email,address}=req.body;
const updatedUser=await User.findByIdAndUpdate(userId,{
  username,phone,altPhone,email,address: [{ address }]},{new:true}
);
req.session.user = updatedUser;
if (updatedUser.profilePic) {
      updatedUser.profilePic = `${req.protocol}://${req.get("host")}${updatedUser.profilePic}`;
    }

res.json({ success: true, message: "Profile updated successfully", data: updatedUser });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
}

module.exports={getUserAccount,uploadProfilePic,updateUserProfile};