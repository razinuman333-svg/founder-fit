import express from 'express'
import { createConnection, getConnection } from '../controllers/connectionController.js'
const connectionRouter = express.Router()

connectionRouter.post('/send/:receiverID',createConnection)
connectionRouter.get('/get',getConnection)


export default connectionRouter