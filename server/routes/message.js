import express from 'express'
import { getConversationsForSidebar, getMessages, getUsersForSidebar } from '../controllers/messageController.js'
import { protectRoute } from '../middlewares/authmiddleware.js'

const messageRouter = express.Router()

messageRouter.use(protectRoute)

messageRouter.get('/conversations',getConversationsForSidebar)
messageRouter.get('/users',getUsersForSidebar)
messageRouter.get('/:id',getMessages)

export default messageRouter