const User=require("../models/user.model");

//getAll

const getAllAddress=async(req,res)=>{
  try{
    const userId=req.user.Id; //JWT Middleware
    const user=await User.findById(userId).select("address");
    if(!user){
       res.status(404).json({success:false,message:"User not found",error:error.message});
    }
    res.json({success:true,data:user.address});

  }
  catch(error){
    res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

//Add new Address

const addAddress=async(req,res)=>{
  try{
    const userId=req.user.Id;
    const {firstName, lastName, email, phoneNumber, address, district, state, landMark, pincode, addressType } = req.body;
    const newAddress={firstName, lastName, email, phoneNumber, address, district, state, landMark, pincode, addressType };
    const user=await User.findById(userId);
    if(!user){
       res.status(404).json({success:false,message:"User not found",error:error.message});
    }
    user.address.push(newAddress);
    await user.save();
     res.json({success:true,message:"Address added successfully",data:user.address});

  }
  catch(error){
   res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

//update an Address
const updateAddress=async(req,res)=>{
  try{
  const userId=req.user.Id;
  const { id } = req.params; 
  const updateData = req.body;
  const user=await User.findById(userId);
   if(!user){
       res.status(404).json({success:false,message:"User not found",error:error.message});
    }
    const address = user.address.id(id); 
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });
    Object.assign(address, updateData); // merge updates
    await user.save();
    res.json({ success: true, message: "Address updated successfully", data: address });
  }
  catch(error){
    res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

//delete address

const deleteAddress = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    const address = user.address.id(id);
    if (!address) return res.status(404).json({ success: false, message: "Address not found" });

    address.deleteOne(); // remove subdocument
    await user.save();

    res.json({ success: true, message: "Address deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Error deleting address", error });
  }
};

module.exports={
  getAllAddress,
  addAddress,
  updateAddress,
  deleteAddress

};