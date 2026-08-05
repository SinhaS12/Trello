import express from 'express';
import { section_validation } from '../types/section_val';
import { middleware } from '../middleware/middleware';
const route=express();
route.use(middleware);

route.post("/createBoard",async(req,res)=>{
    const userId=req.userId;
    if(!userId){
        return res.status(403).json({
            success:false,
            message:"Can,t access the userId"
        })
    }
    const main=section_validation.safeParse(req.body);
    if(!main.success){
        return res.status(402).json({
            success:false,
            message:"Please check the inputs"
        })
    }
    const {boardId,title}=main.data;
    try{
        
        
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
})


route.get("/section",async(require,res)=>{
    try{

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
})

route.put("/sectionRename",async(require,res)=>{
    try{

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
})

route.delete("/sectionDelete",async(require,res)=>{
    try{

    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error"
        })
    }
})



export default route;