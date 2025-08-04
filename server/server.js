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
  res.render('adminaddproducts',{currentPage:'adminaddproducts',addproducts});
})
app.use("/api/auth", authRoutes);

//Notify browser on change
liveReloadServer.server.once("connection", () => {
  setTimeout(() => {
    liveReloadServer.refresh("/");
  }, 100);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
