const products=require("../models/book.model");
const categories=require("../models/category.model");
const mongoose=require("mongoose");

const getAllProductListingContents=async(req,res)=>{
try{

const sortBy=req.query.sortBy||"name";
const order=req.query.order==="desc"?-1:1;
 const page = parseInt(req.query.page) || 1;   
 const limit = parseInt(req.query.limit) || 6; // default 6 products per page
const skip = (page - 1) * limit;
const totalProducts = await products.countDocuments();
const listedProducts=await products.find().sort({[sortBy]:order}).skip(skip).limit(limit);
const listedCategories=await categories.find().sort({[sortBy]:order});
  res.json({success:true,data:{categories:listedCategories,products:listedProducts,totalProducts: totalProducts}});
}
catch(error){
res.status(500).json({success:false,message:"Server error",error:error.message});

}

}

const getproductafterFilterandSort=async(req,res)=>{
try{
  console.log("test");
 const{search,category,priceupto499,price500to1000,price1001to2000,priceabove2000,sortBy,page,limit}=req.query;

 let filter={};

 if(search){
  filter.bookName={$regex:search,$options:"i"};
 }

if (category) {
  const categoriesArray = category.split(",");
  filter.categoryId = { $in: categoriesArray.map(id => new mongoose.Types.ObjectId(id)) };
}
  const priceConditions=[];

  if(priceupto499==="true"){
    priceConditions.push({salePrice:{$gte:0,$lte:499}});
  }
  if(price500to1000==="true"){
    priceConditions.push({salePrice:{$gte:500,$lte:1000}});
  }
  if(price1001to2000==="true"){
    priceConditions.push({salePrice:{$gte:1001,$lte:2000}});
  }
  if(priceabove2000==="true"){
    priceConditions.push({salePrice:{$gte:2001}})
  }

  if(priceConditions.length>0){
    filter.$or=priceConditions;
  }

  let sort={};

  if(sortBy){
    switch(sortBy){
      case "priceLowHigh":
        sort.salePrice=1;
        break;
      case "priceHighLow":
        sort.salePrice=-1;
        break;
      case "alphabeticallyascending":
        sort.bookName=1;
        break;
      case "alphabeticallydescending":
        sort.bookName=-1;
        break;
      default:
        sort.createdAt=-1;
        break;
    }
  }
  else{
    console.log("else block test");
    sort.createdAt=-1;
    console.log(sort);
  }
  

  //pagination

 
  const pageNumber = parseInt(page) || 1;
    const pageSize = parseInt(limit) || 6;
    const skip = (pageNumber - 1) * pageSize;

    const listedProducts=await products.find(filter).sort(sort).skip(skip).limit(pageSize);
    console.log(listedProducts);
    const totalProducts = await products.countDocuments(filter);
    console.log(totalProducts);
    res.json({success:true,data:{products:listedProducts,totalProducts: totalProducts}});

}
catch(error){
  console.log(error);
  res.status(500).json({success:false,message:"Server error",error:error.message});
}




}

module.exports={getAllProductListingContents,getproductafterFilterandSort};
