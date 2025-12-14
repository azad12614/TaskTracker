require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const taskRoutes = require("./routes/taskRoutes");

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "https://tasktracker12614.onrender.com"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/api/admin", authRoutes);
app.use("/api/task", taskRoutes);

connectDB().then(() => {
  app.listen(process.env.PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${process.env.PORT}`);
  });
});
