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





 export const fetchConnectedUsers = async() => {
    
    try {
         const {userId} = req.auth()
        const connectionReq = await Connection.find({receiverID:userId,status:"accepted"}).populate('senderID','name avatar headline skills')
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




 export const updateToAccept = async(req,res) => {
    try {
    const { userId } = req.auth();
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