import express from 'express'
const userRouter = express.Router()
import { addProfile, getAllUser } from '../controllers/userController.js'


userRouter.get('/',getAllUser)
userRouter.post('/add-profile', addProfile)

export default userRouter