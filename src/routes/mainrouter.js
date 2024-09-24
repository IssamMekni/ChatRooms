const express = require("express");
const router = express.Router();


const message=require("./messages");
const chatroom=require("./chatrooms");
const auth = require ("./auth")


router.use("/auth",auth);
router.use("/home/chatroom",chatroom);
router.use("/home/message",message);

module.exports = router ;




