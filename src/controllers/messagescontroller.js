const Message = require("../models/message");
const ChatRoom = require("../models/chatroom");

// Get messages of a chatroom
exports.getChatroomMessages = async (req, res) => {
    try {
        const { chatroomID } = req.params;

        // Check if the chatroom exists
        const chatroom = await ChatRoom.findById(chatroomID);
        if (!chatroom) {
            return res.status(404).json({ success: false, message: "Chatroom not found" });
        }

        // Retrieve messages related to the chatroom
        const messages = await Message.find({ chatroomID })
            .populate("senderID", "username")
            .sort({ timestamp: 1 }); // Sorting messages by timestamp

        res.status(200).json({ success: true, data: messages });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Send a message to a chatroom
exports.sendMessage = async (req, res) => {
    try {
        const userId = req.session.userId; // Assuming user is authenticated and user ID is available
        const { chatroomID } = req.params;
        const { content, mediaURL } = req.body;

        // Check if the chatroom exists
        const chatroom = await ChatRoom.findById(chatroomID);
        if (!chatroom) {
            return res.status(404).json({ success: false, message: "Chatroom not found" });
        }

        // Check if the user is a member of the chatroom
        if (!chatroom.members.includes(userId)) {
            return res.status(403).json({ success: false, message: "You are not a member of this chatroom" });
        }

        // Validate the content field
        if (!content || content.trim() === "") {
            return res.status(400).json({ success: false, message: "Message content cannot be empty" });
        }

        // Create a new message
        const message = new Message({
            senderID: userId,
            chatroomID,
            content,
            mediaURL: mediaURL || null, // Set mediaURL only if provided
        });

        // Save the message
        await message.save();

        // Add the message to the chatroom's messages array
        chatroom.messages.push(message._id);
        await chatroom.save();

        res.status(201).json({ success: true, data: message });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
