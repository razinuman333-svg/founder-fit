import express from 'express'
import { getConversationsForSidebar, getMessages, getUsersForSidebar } from '../controllers/messageController.js'

const messageRouter = express.Router()

messageRouter.get('/conversations',getConversationsForSidebar)
messageRouter.get('/users',getUsersForSidebar)
messageRouter.get('/:id',getMessages)

export default messageRouter