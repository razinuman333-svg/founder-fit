 import Connection from "../models/connection.js"

 
 export const createConnection = async(req,res) => {

  try {

    const {receiverID} = req.params
    const {userId} = req.auth()

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
            data:connectionReq
        })
    } catch (error) {
        res.status(500).json({
        success:false,
        message: error.message
    })
    }

 } 