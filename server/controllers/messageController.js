import Message from '../models/messages.js'
import Connection from '../models/connection.js'
import User from '../models/user.js'




export async function getConversationsForSidebar(req, res) {
  try {
    const {userId} = req.auth()

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
    const {userId} =req.auth()

    const messages = await Message.find({
      $or: [
        { senderId: userId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: userId },
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
    const { userId } = req.auth()

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