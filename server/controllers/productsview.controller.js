const products=require("../models/book.model");
const category=require("../models/category.model");
const author=require("../models/author.model");
const mongoose=require("mongoose");

const getProductsInfo=async(req,res)=>{
try{

  const {id}=req.params;
  console.log(id);

  const book=await products.findById(id).populate("categoryId", "name").populate("authorId", "name image");
if(!book){
  return res.json({success:false,message:"Book not found"});
}
return res.status(200).json({success:true,
  data:{
        _id: book._id,
        bookName: book.bookName,
        author: book.authorId, // includes name & image
        description: book.description,
        cardDescription: book.cardDescription,
        regularPrice: book.regularPrice,
        salePrice: book.salePrice,
        offer: book.offer,
        publisher: book.publisher,
        category: book.categoryId, // includes id & name
        language: book.language,
        coverType: book.coverType,
        images: book.images,
        stockQuantity: book.stockQuantity,
        rating: book.rating,
        showAsTopSelling: book.showAsTopSelling,
        showAsLatest: book.showAsLatest,
        totalPage: book.totalPage,
        publishedDate: book.publishedDate,
        ISBN: book.ISBN
  }
});

}
catch(error){
  res.json({success:false,message:"Server error",error:error.message});
}

}

const getRelatedProducts=async(req,res)=>{

  // const categoryId=req.query.categoryId;
  // const excludedId=req.query.excludedId;
 
try{
   const { categoryId, excludedId } = req.query;
  if (!categoryId || !excludedId) {
      return res.json({ success: false, data: [], message: "Missing query params" });
    }
  const relatedProducts=await products.find({categoryId:categoryId,_id:{$ne:excludedId}}).limit(5).populate("authorId", "name").populate("categoryId", "name");      

  res.json({success:true,data:relatedProducts});

}
catch(error)
{
res.json({success:false,message:"Server error",error:error.message});
}

}

module.exports={getProductsInfo,getRelatedProducts};