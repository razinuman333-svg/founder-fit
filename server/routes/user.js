import express from 'express'
const userRouter = express.Router()
import { addProfile, getAllUser, getUserById } from '../controllers/userController.js'


userRouter.get('/',getAllUser)
userRouter.get('/:id', getUserById)
userRouter.post('/add-profile', addProfile)

export default userRouter