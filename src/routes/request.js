const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");


// SEND CONNECTION REQUEST
requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {

    try {

      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;

      const allowedStatus = ["ignored", "interested"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status type"
        });
      }

      const toUser = await User.findById(toUserId);

      if (!toUser) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status
      });

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request sent successfully",
        data
      });

    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }

  }
);


// REVIEW CONNECTION REQUEST (ACCEPT / REJECT)

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {

    try {

      const loggedInUser = req.user;

      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Status not allowed!"
        });
      }

      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested"
      });

      if (!connectionRequest) {
        return res.status(404).json({
          message: "Connection request not found"
        });
      }

      connectionRequest.status = status;

      const data = await connectionRequest.save();

      res.json({
        message: "Connection request " + status,
        data
      });

    } catch (err) {
      res.status(400).send("Error: " + err.message);
    }

  }
);


module.exports = requestRouter;

