import express from 'express'
import { getConversationsForSidebar } from '../controllers/messageController'

const messageRouter = express.Router()

messageRouter.get('/conversations',getConversationsForSidebar)
messageRouter.get('/:id',)

export default messageRouter