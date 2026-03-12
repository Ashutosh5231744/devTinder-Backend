const express = require("express");
const userRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");  


const USER_SAFE_DATA = "firstName lastName photoUrl age gender about skills";

// GET RECEIVED REQUESTS

userRouter.get("/user/requests/received", userAuth, async (req, res) => {

  try {

    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested"
    }).populate("fromUserId", USER_SAFE_DATA);

    res.json({
      message: "Data fetched successfully",
      data: connectionRequests
    });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

});

userRouter.get("/feed", userAuth, async (req, res) => {

  try {

    const loggedInUser = req.user;

    const page = 1;
    const limit = 10;
    const skip = (page - 1) * limit;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    const hideUsersFromFeed = new Set();

    connectionRequests.forEach((req) => {
      hideUsersFromFeed.add(req.fromUserId.toString());
      hideUsersFromFeed.add(req.toUserId.toString());
    });

    const users = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersFromFeed) } },
        { _id: { $ne: loggedInUser._id } }
      ]
    }).select("firstName lastName age gender about skills photoUrl")
      .skip(skip)
      .limit(limit);

    res.json({
      message: "Feed fetched successfully",
      data: users
    });

  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }

});

module.exports = userRouter;