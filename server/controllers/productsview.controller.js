const products=require("../models/book.model");
const category=require("../models/category.model");

const getProductsInfo=async(req,res)=>{
try{

  const {id}=req.params;
  console.log(id);

  const book=await products.findById(id).populate("categoryId", "categoryName");
if(!book){
  return res.json({success:false,message:"Book not found"});
}
return res.status(200).json({success:true,data:book});
// res.status(200).json({success:true,data:  {
//     bookName: book.bookName,
//     author: book.author,
//     description: book.description,
//     regularPrice: book.regularPrice,
//     publisher: book.publisher,
//     category:book.categoryId,//id and name
//     language: book.language,
//     coverType: book.coverType,
//     images: book.images,
//     stockQuantity: book.stockQuantity,
//     rating: book.rating,
//     showAsTopSelling: book.showAsTopSelling,
//     showAsLatest: book.showAsLatest,
//     offer: book.offer,
//     salePrice: book.salePrice,
//     totalPage: book.totalPage,
//     publishedDate: book.publishedDate,
//     cardDescription: book.cardDescription
//   },})

}
catch(error){
  res.json({success:false,message:"Server error",error:error.message});
}

}

const getRelatedProducts=async(req,res)=>{

  const categoryId=req.query.categoryId;
  const excludedId=req.query.excludedId;
try{
  const relatedProducts=await products.find({categoryId:categoryId,_id:{$ne:excludedId}}).limit(5);
  res.json({success:true,data:relatedProducts});

}
catch(error)
{
res.json({success:false,message:"Server error",error:error.message});
}

}

module.exports={getProductsInfo,getRelatedProducts};