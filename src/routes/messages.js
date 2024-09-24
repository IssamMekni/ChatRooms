const express = require ("express");
const router = express.Router();

const {getChatroomMessages,sendMessage} = require("../controllers/messagescontroller")

// loading messages of chatroom
router.get("/:chatroomID/messages",getChatroomMessages);

// send message
router.post("/:chatroomID/sendmessage",sendMessage);

module.exports= router;