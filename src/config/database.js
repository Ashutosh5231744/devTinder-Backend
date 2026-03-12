const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.DB_CONNECTION_SECRET);
    console.log("Database connection established...");
  } catch (err) {
    console.log("DB CONNECTION ERROR:", err);
  }
};

module.exports = connectDB;