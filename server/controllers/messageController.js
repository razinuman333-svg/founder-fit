import Message from '../models/messages.js'
import Connection from '../models/connection.js'
import User from '../models/user.js'
import { hasImageKitConfig, uploadChatMedia } from '../config/imagekit.js'
import { getReceiverRoom, io } from '../config/socket.js'




export async function getConversationsForSidebar(req, res) {
  try {
    const userId = req.user._id;

    const conversations = await Message.aggregate([
      // 1. Keep only the messages I sent or received.
      { $match: { $or: [{ senderID: userId }, { receiverID: userId }] } },
      // 2. Collapse them into one row per chat partner, noting our latest message time.
      {
        $group: {
          // The partner is the other person on the message (not me).
          _id: { $cond: [{ $eq: ["$senderID", userId] }, "$receiverID", "$senderID"] },
          lastMessageAt: { $max: "$createdAt" },
        },
      },
      // 3. Put the most recent conversation at the top.
      { $sort: { lastMessageAt: -1 } },
      // 4. Look up each partner's user profile (comes back as an array).
      { $lookup: { from: "users", localField: "_id", foreignField: "_id", as: "user" } },
      // 5. Pull that profile out of the array and make it the document.
      { $replaceRoot: { newRoot: { $first: "$user" } } }
      
    ]);

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error in getConversationsForSidebar:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function getMessages(req, res) {
  try {
    const { id: userToChatId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
      $or: [
        { senderID: userId, receiverID: userToChatId },
        { senderID: userToChatId, receiverID: userId },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const getUsersForSidebar = async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' })
    }

    const connections = await Connection.find({
      status: 'accepted',
      $or: [{ senderID: userId }, { receiverID: userId }],
    }).select('senderID receiverID')

    const connectedUserIds = connections.map((connection) => (
      connection.senderID === userId ? connection.receiverID : connection.senderID
    ))

    const users = await User.find({ _id: { $in: connectedUserIds } })
      .select('name avatar headline skills')

    return res.status(200).json({ success: true, users })
  } catch (error) {
    console.error('Error in getUsersForSidebar:', error.message)
    return res.status(500).json({ success: false, message: 'Internal server error' })
  }
}





export async function sendMessage(req, res) {
  try {
    const { text } = req.body;
    const { id: receiverID } = req.params;
    const senderID = req.user._id;

    let imageUrl;
    let videoUrl;

    if (req.file) {
      if (!hasImageKitConfig()) {
        return res.status(500).json({ message: "Media upload is not configured" });
      }

      const url = await uploadChatMedia(req.file);
      if (req.file.mimetype.startsWith("video/")) videoUrl = url;
      else imageUrl = url;
    }

    const newMessage = new Message({
      senderID,
      receiverID,
      text,
      image: imageUrl,
      video: videoUrl,
    });

    const savedMessage = await newMessage.save();

    const receiverRoom = getReceiverRoom(String(receiverID));
    if (receiverRoom) {
      io.to(receiverRoom).emit("newMessage", savedMessage);
    }

    res.status(201).json(savedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
}