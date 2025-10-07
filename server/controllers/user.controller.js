const User=require("../models/user.model");
const Order=require("../models/order.model");

const getUserAccount=async(req,res)=>{
try{
const userId=req.session?.userId||req.user?.id;
if(!userId){
  return res.status(401).json({success:false,message:"Unauthorized attempt"});
}
const user=await User.findById(userId).lean();//lean();gives plane js object
if(!user){
  return res.status(404).json({success:false,message:"User details not found"});
}

//orderCount
const orderCount=await Order.countDocuments({userId});
//wishListCount
const wishListCount=ServiceWorker.wishList?.length||0;

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
    const userId=req.session?.userId||req.user?.id;
if(!userId){
  return res.status(401).json({success:false,message:"Unauthorized attempt"});
}
if (!req.file) return res.status(400).json({ success: false, message: "No file uploaded" });
const user=await User.findById(userId);
user.profilePic=`/uploads/profilePic/${req.file.filename}`;
await user.save();
res.json({ success: true, message: "Profile picture updated", profilePic: user.profilePic });
  }
  catch(error){
    res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

module.exports={getUserAccount,uploadProfilePic};