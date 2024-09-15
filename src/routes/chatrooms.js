const express= require("express");

router= express.Router();

// get list of the joined chatroom
router.get("/joinedroom");

// search about chatrooms
router.get("/search",(req,res)=>{
    const {name} = req.query ;
});

// create chatroom
router.post("/create");

// delete chatroom
router.delete("/:chatroomID");

// join chattroom
router.post("/:chatroomID/join");

// quit chatroom
router.post("/:chatroomID/quit");


module.exports = router ;