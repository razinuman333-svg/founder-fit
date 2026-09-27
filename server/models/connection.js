import mongoose from 'mongoose'

const connectionSchema = new mongoose.Schema({

    senderID : {type:String, ref:'User'},

   receiverID  : {type:String, ref:'User'},

    status : {type:String , default: "pending"}

},{timestamps: true })

const Connection = mongoose.model('Connection',connectionSchema)
export default Connection