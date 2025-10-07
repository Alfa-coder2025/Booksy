const express = require("express");
const dotenv = require("dotenv");
dotenv.config();
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

const app = express();

// Connect to DB
connectDB();

app.use(express.json());

// 1. LiveReload server
const liveReloadServer = livereload.createServer();
liveReloadServer.watch(path.join(__dirname, "public"));
liveReloadServer.watch(path.join(__dirname, "views"));

// 2. Middleware for injecting livereload script
app.use(connectLivereload());

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));

app.use(
  session({
    secret: "your-random-secret-key",
    resave: false,
    saveUninitialized: true,
  })
);

// 👇 Initialize default session object if missing
app.use((req, res, next) => {
  if (!req.session.sessionData) {
    req.session.sessionData = JSON.parse(JSON.stringify(defaultSession));
  }
  next();
});

//Backend APIs
app.use("/api/auth", require("./routes/auth.routes"));

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


//import admin.api/admin


// 👇 Make session data available to all EJS views
app.use((req, res, next) => {
  res.locals.session = req.session.sessionData;
  next();
});
//UI APIs
app.get("/signup", (req, res) => {
  res.render("signup", { session: req.session.sessionData.defaultSession });
});

app.get("/login", (req, res) => {
  res.render("login", { session: req.session.sessionData.defaultSession });
});
app.get("/enterotp", (req, res) => {
  res.render("enterotp", { session: req.session.sessionData.defaultSession });
});
app.get("/forgotpassword", (req, res) => {
  res.render("forgotpassword", {
    session: req.session.sessionData.defaultSession,
  });
});
app.get("/changepassword", (req, res) => {
  res.render("changepassword", {
    session: req.session.sessionData.defaultSession,
  });
});
app.get("/navbar", (req, res) => {
  res.render("navbar", {
    session: req.session.sessionData.defaultSession,
  });
});
app.get("/footer", (req, res) => {
  res.render("footer", {
    session: req.session.sessionData.defaultSession,
  });
});
app.get("/landingpage", (req, res) => {
  res.render("landingpage", {
    session: req.session.sessionData.defaultSession,
  });
});
app.get("/homepage", (req, res) => {
  res.render("homepage", {
    session: req.session.sessionData.defaultSession,
  });
});

app.get("/admindashboard", (req, res) => {
  res.render("admindashboard", {
    session: req.session.sessionData.defaultSession,
    currentPage: "dashboard",
    
  });
});
app.get("/admin-users", (req, res) => {
  res.render("adminusers", {
    session: req.session.sessionData.defaultSession,
    currentPage: "users",
    users: []
  });
});

app.get('/admin-category', (req, res) => {
  res.render('category',{ currentPage: 'category' });
});

app.get('/admin-products', (req, res) => {
  res.render('adminproducts',{ currentPage: 'adminproducts',products: []});
});

app.get('/admin-addproducts',(req,res)=>{
  res.render('addproducts',{currentPage:'addproducts'});
})

app.get('/admin-editproducts',(req,res)=>{
  res.render('editproducts',{currentPage:'editproducts'});
})
app.get('/admin-offermanagement',(req,res)=>{
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
app.get('/useraccount',(req,res)=>{
  res.render('useraccount',{currentPage:'useraccount'});
})
app.get('/userorders',(req,res)=>{
  res.render('userorders',{currentPage:'userorders'});
})
app.get('/changepassword',(req,res)=>{
  res.render('changepassword',{currentPage:'changepassword'});
})
app.get('/addressbook',(req,res)=>{
  res.render('addressbook',{currentPage:'addressbook'});
})







//Notify browser on change
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
