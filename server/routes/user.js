import express from 'express'
const userRouter = express.Router()
import { addProfile } from '../controllers/userController.js'



userRouter.post('/add-profile', addProfile)

export default userRouter