import express from 'express';
import { comments_validation } from '../types/comment_val';
const route=express();


route.post("/comment",async(req,res)=>{
    const main=comments_validation.safeParse(req.body);
    if(!main.success){
        return res.status(422).json({
            success:false,
            message:"Please enter the message "
        })
    }
    const {organizationId,boardId,sectionId,issueId}=main.data;
    try{
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})


 
route.get("/allcomments",async(req,res)=>{
    try{
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})