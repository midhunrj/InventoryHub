import express from 'express'
import mongoose from 'mongoose'
import dotenv from 'dotenv'
import cors, { CorsOptions } from 'cors'
import userRouter from './routes/inventoryRoutes'
import cookieParser from 'cookie-parser'
dotenv.config()

const app=express()

app.use(express.json())

app.use(cookieParser())
const corsOptions:CorsOptions={
    origin:[process.env.CLIENT_URL!,"http://localhost:5173"],   
    // allowedHeaders: ['Content-Type', 'Authorization','*'],
    credentials: true,
};
app.use(cors(corsOptions))
app.use('/',userRouter)

mongoose.connect(process.env.Mongodb_URL!)
.then(()=>{
    console.log("mongodb connected");
    
})
.catch((error)=>{
    if (error instanceof Error) {
        console.error(`Error: ${error.message}`);
      } else {
        console.error('An unknown error occurred');
      }
    
})

app.listen(4876,()=>{
    console.log("server is connected and running on port 4876");
    
})