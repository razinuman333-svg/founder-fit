import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import connectDB from './config/db.js' 
import { inngest,functions } from './inngest/index.js' 
import userRouter from './routes/user.js'
import connectionRouter from './routes/connection.js';
import messageRouter from './routes/message.js';
import authRouter from './routes/auth.js';

const app = express()
const PORT = 3000


await connectDB()

app.use(cors())
app.use(express.json({ limit: '10mb' }))
app.use(clerkMiddleware())
app.use( "/api/inngest",
  serve({
    client: inngest,
    functions,
  }))





//API ROUTES
app.get('/',(req,res)=>{res.send('Hello express')})
app.use('/api/user',userRouter)
app.use('/api/auth',authRouter)
app.use('/api/connection',connectionRouter)
app.use('/api/message',messageRouter)





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});