import express from 'express'
import { protectRoute } from '../middlewares/authmiddleware.js'
import { checkAuth } from '../controllers/authController.js'
const authRouter = express.Router()



authRouter.get('/check',protectRoute,checkAuth)

export default authRouter