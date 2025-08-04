const jwt=require("jsonwebtoken");

function authenticateToken(req,res,next){
//  const header=req.header("Authorization");
 
//   const token=header&&header.split(" ")[1];
//
//   if(!token){
//     return res.status(401).json({success:false,err:"Unauthorized Request"});
//   }
  try{
  //  const decoded=jwt.verify(token,process.env.JWT_SECRET);

  //   req.user=decoded;
   next();
  }
  catch(err){
  
    return res.status(403).json({sucess:false,error:"Invalid Token"});
    
  }
}

module.exports=authenticateToken;