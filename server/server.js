const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
dotenv.config();
const passport=require("./config/passport");
const connectDB = require("./config/db.config");
const authRoutes = require("./routes/auth.routes");
const path = require("path");
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const session = require("express-session");
const defaultSession = require("./utils/session");
const adminRoutes = require("./routes/admin.routes");
const adminproductRoutes=require("./routes/product.routes");
const landingPageRoutes=require("./routes/landingpage.routes");
const productlistingRoutes=require("./routes/productlisting.routes");
const productsviewRoutes=require("./routes/productsview.routes");
const useraccountRoutes=require("./routes/user.routes");
const addressBookRoutes=require("./routes/addressbook.routes");
const admindashboardRoutes=require("./routes/admindashboard.routes");
const authorRoutes=require("./routes/author.routes");
const{ensureAuthenticated,preventAuthAccess,noCache,ensureAdmin}=require("./middlewares/authMiddleware");



const app = express();


// Connect to DB
connectDB();

app.use(cors({
  origin: true, 
  credentials: true
}));


app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(
  session({
    secret: "your-random-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
    secure: false,             // true only for HTTPS
    httpOnly: true,
    sameSite: "lax"            // important for cross-origin cookies
  }

  })
);



app.use((req, res, next) => {
  if (!req.session.sessionData) {
    req.session.sessionData = JSON.parse(JSON.stringify(defaultSession));
  }
  next();
});

//passport
app.use(passport.initialize());
app.use(passport.session());

// // 1. LiveReload server
// const liveReloadServer = livereload.createServer();
// liveReloadServer.watch(path.join(__dirname, "public"));
// liveReloadServer.watch(path.join(__dirname, "views"));

if (process.env.NODE_ENV === "development") {
  const liveReloadServer = livereload.createServer();
  liveReloadServer.watch(path.join(__dirname, "public"));
  liveReloadServer.watch(path.join(__dirname, "views"));
  app.use(connectLivereload());
  liveReloadServer.server.once("connection", () => {
    setTimeout(() => liveReloadServer.refresh("/"), 100);
  });
}



// // // 2. Middleware for injecting livereload script
// app.use(connectLivereload());

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));



// // 👇 Initialize default session object if missing
// app.use((req, res, next) => {
//   if (!req.session.sessionData) {
//     req.session.sessionData = JSON.parse(JSON.stringify(defaultSession));
//   }
//   next();
// });

app.use((req, res, next) => {
  res.locals.session = req.session.sessionData;
  next();
});
app.use(noCache);

//Backend APIs
// app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api", adminRoutes); 
app.use("/api/category",require("./routes/category.routes"));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use("/api/users",require("./routes/users.routes"));
//app.use("/api/product",require)
app.use("/api/admin/products",adminproductRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/user/landingPage",landingPageRoutes);
app.use("/api/user/productslisting",productlistingRoutes);
app.use("/api/user/productsview",productsviewRoutes);
app.use("/api/user/useraccount",useraccountRoutes);
app.use("/api/user/addressBook",addressBookRoutes);
app.use("/api/admin/dashboard",admindashboardRoutes);
app.use("/api/admin/author",authorRoutes);


//import admin.api/admin


// // 👇 Make session data available to all EJS views
// app.use((req, res, next) => {
//   res.locals.session = req.session.sessionData;
//   next();
// });
//UI APIs
app.get("/", (req, res) => {
  res.redirect("/landingpage");
});
app.get("/signup", (req, res) => {
  res.render("signup", { session: req.session.sessionData});
});

app.get("/login",(req, res) => {
  
 
  res.render("login", { session: req.session.sessionData});
 
});
// app.get("/enterotp", (req, res) => {
  
//   res.render("enterotp", { session: req.session.sessionData});
// });
app.get("/enterotp", (req, res) => {
  // Ensure sessionData exists
  if (!req.session.sessionData) {
    req.session.sessionData = JSON.parse(JSON.stringify(defaultSession));
  }

  // Merge signupData into session for EJS
  const session = { ...req.session.sessionData };
  if (req.session.signupData) {
    session.signupData = req.session.signupData; // accessible in EJS
  }

  console.log("Rendering enterotp with session:", session);
  res.render("enterotp", { session });
});

app.get("/forgotpassword", preventAuthAccess,(req, res) => {
  res.render("forgotpassword", {
    session: req.session.sessionData,
  });
});
app.get("/changepassword", (req, res) => {
  res.render("changepassword", {
    session: req.session.sessionData,
  });
});
app.get("/navbar", (req, res) => {
  res.render("navbar", {
    session: req.session.sessionData,
  });
});
app.get("/footer", (req, res) => {
  res.render("footer", {
    session: req.session.sessionData,
  });
});
app.get("/landingpage", (req, res) => {
  res.render("landingpage", {
    session: req.session.sessionData,
  });
});
app.get("/homepage", (req, res) => {
  res.render("homepage", {
    session: req.session.sessionData,
  });
});

app.get("/admindashboard",ensureAdmin, (req, res) => {
  res.render("admindashboard", {
    session: req.session.sessionData,
    currentPage: "dashboard",
    
  });
});
app.get("/admin-users", ensureAdmin,(req, res) => {
  res.render("adminusers", {
    session: req.session.sessionData,
    currentPage: "users",
    users: []
  });
});

app.get('/admin-category',ensureAdmin, (req, res) => {
  res.render('category',{ currentPage: 'category' });
});

app.get('/admin-products', ensureAdmin,(req, res) => {
  res.render('adminproducts',{ currentPage: 'adminproducts',products: []});
});

app.get('/admin-addproducts',ensureAdmin,(req,res)=>{
  res.render('addproducts',{currentPage:'addproducts'});
})

app.get('/admin-editproducts',ensureAdmin,(req,res)=>{
  res.render('editproducts',{currentPage:'editproducts'});
})
app.get('/admin-offermanagement',ensureAdmin,(req,res)=>{
  res.render('offermanagement',{currentPage:'offermanagement'});
})
app.get('/user-productslisting',(req,res)=>{
  res.render('productslisting',{currentPage:'productslisting'});
})
app.get('/user-productsview',(req,res)=>{
  res.render('productsview',{currentPage:'productsview'});
})
app.get('/contactpage',(req,res)=>{
  res.render('contactpage',{currentPage:'contactpage'});
})
app.get('/about',(req,res)=>{
  res.render('about',{currentPage:'about'});
})
app.get('/useraccount',ensureAuthenticated,(req,res)=>{
  res.render('useraccount',{currentPage:'useraccount'});
})
app.get('/userorders',ensureAuthenticated,(req,res)=>{
  res.render('userorders',{currentPage:'userorders'});
})
app.get('/changepassword',(req,res)=>{
  res.render('changepassword',{currentPage:'changepassword'});
})
app.get('/addressbook',ensureAuthenticated,(req,res)=>{
  res.render('addressbook',{currentPage:'addressbook'});
})







// //Notify browser on change
// liveReloadServer.server.once("connection", () => {
//   setTimeout(() => {
//     liveReloadServer.refresh("/");
//   }, 100);
// });

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
