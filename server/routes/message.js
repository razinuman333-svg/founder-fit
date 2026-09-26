import express from 'express'
import { upload } from '../middlewares/upload.js'
import { getConversationsForSidebar, getMessages, getUsersForSidebar, sendMessage } from '../controllers/messageController.js'
import { protectRoute } from '../middlewares/authmiddleware.js'

const messageRouter = express.Router()

messageRouter.use(protectRoute)

messageRouter.get('/conversations',getConversationsForSidebar)
messageRouter.get('/users',getUsersForSidebar)
messageRouter.get('/:id',getMessages)
messageRouter.post("/send/:id", upload.single("media"), sendMessage);


export default messageRouter