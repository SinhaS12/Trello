import express from 'express';
import {prisma} from 'db';
import { signin_validation, signup_validation } from '../validation/users';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { error } from 'console';
if(!process.env.JWT_SECRET){
    throw error("Can,t Access the JWT_SECRET");
}
const jwt_pass=process.env.JWT_SECRET;





const route=express.Router();


route.post("/signup",async(req,res)=>{
    const main=signup_validation.safeParse(req.body);
    if(!main.success){
        return res.status(403).json({
            success:false,
            message:"Please check the inputs"
        })
    }
    const {email,name,password}=main.data;
    try{
        const find_existing=await prisma.user.findMany({where:{email}});
        if(find_existing){
            return res.status(402).json({
                success:false,
                message:"User already exist!"
            })
        }
        const hide=await bcrypt.hash(password,10);
        const new_one=await prisma.user.create({
            data:{
                name,
                password:hide,
                email,
            },
            select:{
                name:true,
            }
        })
        const token=jwt.sign({email:email},jwt_pass);
        return res.status(200).json({
            success:true,
            message:"Signup Completed",
            name:new_one,
            token:token
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})

route.post("/signin",async(req,res)=>{
    const main=signin_validation.safeParse(req.body);
    if(!main.success){
        return res.status(403).json({
            success:false,
            message:"Please check the inputs"
        })
    }
    const {email,password}=main.data;
    try{
        const find_existing=await prisma.user.findUnique({where:{email}});
        if(!find_existing){
            return res.status(403).json({
                success:false,
                message:"User Does not exists"
            })
        }
        const pass=await bcrypt.compare(password,find_existing.password);
        if(!pass){
            return res.status(403).json({
                success:false,
                message:"Incorrect password please check !"
            })
        }
        const token=jwt.sign({email:email},jwt_pass);
        return res.status(200).json({
            success:true,
            message:"Sigin Done Successfully",
            token:token
        })

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})