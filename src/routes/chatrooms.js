const express= require("express");

router= express.Router();

const {getListJoinedRoom,searchForRoom,createRoom,deleteRoom,joinRoom,quitRoom} = require("../controllers/chatroomscontroller");

// get list of the joined chatroom
router.get("/joinedroom",getListJoinedRoom);

// search about chatrooms
router.get("/search",searchForRoom);

// create chatroom
router.post("/create",createRoom);

// delete chatroom
router.delete("/:chatroomID",deleteRoom);

// join chattroom
router.post("/:chatroomID/join",joinRoom);

// quit chatroom
router.post("/:chatroomID/quit",quitRoom);


module.exports = router ;