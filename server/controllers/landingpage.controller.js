const Category = require("../models/category.model");
const Books=require("../models/book.model");
const getAllLandingPageContents=async(req,res)=>{
try{
  const sortBy=req.query.sortBy||"name";
  const order=req.query.order==="desc"?-1:1;
  const landingPageCategories=await Category.find({showOnHomepage:true}).sort({[sortBy]:order});
  const topsellingBooks=await Books.find({showAsTopSelling:true}).sort({[sortBy]:order});
  const latestBooks=await Books.find({showAsLatest:true}).sort({[sortBy]:order});

  res.json({success:true,data:{categories:landingPageCategories,topselling:topsellingBooks,latestBooks:latestBooks}});
}
catch(error){
  res.status(500).json({success:false,error:"Server Error",err:error});
}

}

module.exports={getAllLandingPageContents};