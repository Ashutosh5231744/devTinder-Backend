const express = require("express");
const authRouter = express.Router();
const User = require("../models/user");
const bcrypt = require("bcrypt");

// SIGNUP API
authRouter.post("/signup", async (req, res) => {
  try {

    const { firstName, lastName, emailId, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash
    });

    const savedUser = await user.save();

    res.json({
      message: "User Added Successfully",
      data: savedUser
    });

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});


// LOGIN API
authRouter.post("/login", async (req, res) => {
  try {

    const { emailId, password } = req.body;

    const user = await User.findOne({ emailId });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {

      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true
      });

      res.send("Login Successful");

    } else {
      throw new Error("Invalid credentials");
    }

  } catch (err) {
    res.status(400).send("Error: " + err.message);
  }
});

module.exports = authRouter;