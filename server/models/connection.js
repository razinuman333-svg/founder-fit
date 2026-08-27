import mongoose from 'mongoose'

const connectionSchema = new mongoose.Schema({

    senderID : {type:mongoose.Schema.Types.ObjectId, ref:'User'},

    receiverID : {type:mongoose.Schema.Types.ObjectId, ref:'User'},

    status : {type:String , default: "pending"}

},{timestamps: true })

const Connection = mongoose.model('Connection',connectionSchema)
export default Connection