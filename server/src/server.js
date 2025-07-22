const express = require("express");
const connectDB = require("./config/db.config");
const authRoutes = require("./routes/auth.routes");

const app = express();

// Connect to DB
connectDB();

app.use(express.json());

app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/auth",authRoutes);

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));

