import express from "express";
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from "./config/db.js";
import router from "./router/route.js";


dotenv.config()
const PORT = process.env.PORT || 5000
const app = express()


app.use(cors())
app.use(express.json({ limit : '50mb'}))
app.use(express.urlencoded({extended : true,}))

app.get('/',(req,res)=>{
    res.send('hello world')
})

app.use('/api/v1',router)

app.listen(PORT,()=>{
    connectDB()
    console.log(`server is running on port : ${PORT}`)
})

