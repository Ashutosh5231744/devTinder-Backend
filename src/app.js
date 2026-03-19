require("dotenv").config();

const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");

const app = express();

// Middlewares
app.use(express.json());
app.use(cookieParser());

// 🔥 FINAL CORS FIX (LOCAL + PRODUCTION)
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://devtinder-frontend-eta.vercel.app",
    ],
    credentials: true,
  })
);

// ROUTES
app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

// SERVER
const server = http.createServer(app);

connectDB()
  .then(() => {
    console.log("Database connection established...");
    server.listen(process.env.PORT, () => {
      console.log(
        "Server is successfully listening on port",
        process.env.PORT
      );
    });
  })
  .catch((err) => {
    console.error("Database cannot be connected!!", err);
  });