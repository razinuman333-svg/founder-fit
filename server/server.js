import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import {app,server} from './config/socket.js'
import { serve } from "inngest/express";
import { clerkMiddleware } from '@clerk/express'
import connectDB from './config/db.js' 
import { inngest,functions } from './inngest/index.js' 
import userRouter from './routes/user.js'
import connectionRouter from './routes/connection.js';
import messageRouter from './routes/message.js';
import authRouter from './routes/auth.js';


const PORT = 3000
const FRONTEND_URL = process.env.FRONTEND_URL;



app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));
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





server.listen(PORT, () => {
   connectDB()
  console.log(`Server running on http://localhost:${PORT}`);
});