 import Connection from "../models/connection.js"

 
 export const createConnection = async(req,res) => {

  try {

    const {receiverID} = req.params
    const {userId} = req.auth()

    if(!userId){
        return res.status(401).json({success:false,message:'Unauthorized'})
    }

    const connection = await Connection.create({
        senderID : userId,
        receiverID : receiverID,
    })

    res.status(200).json({
        success:true,
        connection
    })

  } catch (error) {
    res.status(500).json({
        success:false,
        message: error.message
    })
  }
   

}




 export const getConnection = async(req,res) => {
    try {
        const {userId} = req.auth()

        if (!userId) return res.status(401).json({success:false,message:'Unauthorized'})

        const connectionReq = await Connection.find({receiverID:userId,status:"pending"}).populate('senderID','name avatar headline')
        res.status(200).json({
            success:true,
            connectionReq
        })
    } catch (error) {
        res.status(500).json({
        success:false,
        message: error.message
    })
    }

 } 





 export const fetchConnectedUsers = async(req,res) => {
    
    try {
      const { userId } = req.auth()

      if (!userId) return res.status(401).json({success:false,message:'Unauthorized'})

        const connectionReq = await Connection.find({
      status: "accepted",
      $or: [
        { receiverID: userId },
        { senderID: userId }
      ]
    })
      .populate('senderID', 'name avatar headline skills')
      .populate('receiverID', 'name avatar headline skills');

    // 2. Extract only the other user's profile from each connection
    const connectedUsers = connectionReq.map(conn => {
      // Check if the current user is the sender
      const isSender = (conn.senderID._id || conn.senderID).toString() === userId.toString();
      
      // If you are the sender, the friend is receiverID; otherwise, the friend is senderID
      return isSender ? conn.receiverID : conn.senderID;
    });

    // 3. Send back the clean list of connected users
    res.status(200).json({
      success: true,
       connectedUsers
    })
    } catch (error) {
         res.status(500).json({
        success:false,
        message: error.message
    })
    }
 }




 export const updateToAccept = async(req,res) => {
    try {
    const { userId } = req.auth();

    if (!userId) return res.status(401).json({success:false,message:'Unauthorized'})

    const { senderID } = req.params;

    const updatedConnection = await Connection.findOneAndUpdate(
      {
        senderID: senderID,
        receiverID: userId,
        status: "pending"
      },
      {
        $set: { status: "accepted" }
      },
      { new: true } // Returns the updated document
    );

    if (!updatedConnection) {
      return res.status(404).json({
        success: false,
        message: "Connection request not found or already handled"
      });
    }

    res.status(200).json({
      success: true,
      message: "Connection request accepted",
      data: updatedConnection
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
 }