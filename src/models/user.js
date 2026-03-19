const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
      default: "",
    },
    emailId: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      default: null,
    },
    gender: {
      type: String,
      enum: ["male", "female", "other", ""],
      default: "",
    },
    about: {
      type: String,
      default: "",
      trim: true,
    },
    photoUrl: {
      type: String,
      default: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=80",
      trim: true,
    },
    skills: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// JWT TOKEN METHOD
userSchema.methods.getJWT = async function () {
  const user = this;

  const token = jwt.sign(
    { _id: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );

  return token;
};

module.exports = mongoose.model("User", userSchema);