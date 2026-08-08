import 'dotenv/config'
import express from 'express'
import connectDB from './config/db.js' 


const app = express()
const PORT = 3000


await connectDB()


app.use(express.json())


app.get('/',(req,res)=>{
    res.send('Hello express')
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});