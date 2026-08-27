import express from 'express'
import { createConnection } from '../controllers/connectionController'
const connectionRouter = express.Router()

connectionRouter.post('/:receiverId',createConnection)


export default connectionRouter