dotenv.config();
import { error } from 'console';
import express from 'express';
import dotenv from 'dotenv'
import authroute from './src/route/auth.ts';
import createOrgroute from './src/route/organization.ts';
import createBoard from './src/route/board.ts';
const app=express();
app.use(express.json());
if(!process.env.BACKEND_PORT){
    throw error("Can,t Access the Backend Port")
}
const port=process.env.BACKEND_PORT;


app.use("/auth",authroute);
app.use("/org",createOrgroute);
app.use("/board",createBoard);




app.listen(port,()=>{
    console.log("Backend Sercer is running on this port")
})