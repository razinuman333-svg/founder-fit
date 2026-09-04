import express from 'express'
import { createConnection, fetchConnectedUsers, getConnection, updateToAccept } from '../controllers/connectionController.js'
const connectionRouter = express.Router()

connectionRouter.post('/send/:receiverID',createConnection)
connectionRouter.get('/get',getConnection)
connectionRouter.get('/getConnectedUsers',fetchConnectedUsers)
connectionRouter.put('/updatetoaccept/:senderID',updateToAccept)


export default connectionRouter