import express from 'express'
import { protectRoute } from '../middlewares/authmiddleware'
import { checkAuth } from '../controllers/authController'
const authRouter = express.Router()



authRouter.get('/check',protectRoute,checkAuth)

export default authRouter