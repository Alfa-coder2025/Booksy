function ensureAuthenticated(req,res,next){
 
  if(req.session.user){
   
    return next();
  }
  
   return res.redirect("/login");
}

function preventAuthAccess(req, res, next) {
  if (!req.session.user) return next(); 
  // UI request → redirect based on role
  if (req.session.user.role === "admin") {
    return res.redirect("/admindashboard");
  } else {
    return res.redirect("/landingpage");
  }
}


function noCache(req, res, next) {
    res.set({
        'Cache-Control': 'no-cache, no-store, must-revalidate, private, max-age=0',
        'Pragma': 'no-cache',
        'Expires': '0',
        'Surrogate-Control': 'no-store'
    });
    next();
}

function ensureAdmin(req,res,next){
  
  if (!req.session.user) {
    return res.redirect("/login"); // Not logged in
  }
  if(req.session.user.role!=="admin"){
    
   return res.redirect("/landingpage");
  }
  next();
}
module.exports={ensureAuthenticated,preventAuthAccess,noCache,ensureAdmin};