dotenv.config();
import { error } from 'console';
import express from 'express';
import dotenv from 'dotenv'
const app=express();

if(!process.env.BACKEND_PORT){
    throw error("Can,t Access the Backend Port")
}
const port=process.env.BACKEND_PORT;






app.listen(port,()=>{
    console.log("Backend Sercer is running on this port")
})