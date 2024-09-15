const mongoose= require("mongoose");

const chatroomschema = mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true,
      
    },
    creator:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"User",
        
    },
    members:[{
        type:mongoose.Schema.ObjectId,
        ref:"User",
    }],
    messages:[{
        type:mongoose.Schema.ObjectId,
        ref:"Message",
    }],
});

const ChatRoom= mongoose.model("ChatRoom",chatroomschema);
ref:"User",
module.exports= ChatRoom;