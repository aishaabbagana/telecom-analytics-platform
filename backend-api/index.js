const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const cdrRoutes = require("./routes/cdrRoutes");
const authRoutes = require("./routes/authRoutes");
require("dotenv").config();

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(cors());

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.log("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.json({message: "Welcome to the Telecom Intelligence Platform API"});
});

app.get("/api/status", (req, res) => {
    res.json({status: "active"});
});

app.use("/api/cdrs", cdrRoutes);
app.use("/api/auth", authRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})

