const express = require ("express");
const router = express.Router();

// loading messages of chatroom
router.get("/:chatroomID/messages");

// send message
router.post("/:chatroomID/sendmessage");

module.exports= router;