const Order=require("../models/order.model");
const User=require("../models/user.model");

const getAdminDashboard=async(req,res)=>{
  try {
    
    const totalUsers=await User.countDocuments();
    const totalOrders=await Order.countDocuments();
    const totalSalesAgg=await Order.aggregate([{$group:{_id:null,total:{$sum:"$totalAmount"}}}]);
    let totalSales=0;
    if(totalSalesAgg[0]){
      totalSales=totalSalesAgg[0].total;
    }
    const orders=await Order.find().limit(5).populate("userId","username email").lean();

    const tableData=orders.map(order=>({
      id:order._id,
      customerName:order.userId?.username||"Unknown",
      email:order.userId?.email||"Unknown",
      address:`${order.shippingAddress.street}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.zipCode}`,
      date:order.orderedAt,
      type:order.items.length+" items",
      status:order.orderStatus
  }));

    res.json({ success: true, totalUsers, totalOrders, totalSales, tableData });
  } catch (error) {
    res.status(500).json({success:false,message:"Server error",error:error.message});
  }
}

module.exports={getAdminDashboard};