import express from 'express'




const app = express()
const PORT = 3000


app.get('/',(req,res)=>{
    res.send('Hello express')
})


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});