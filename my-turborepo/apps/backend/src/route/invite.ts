import express from 'express';
import { middleware } from '../middleware/middleware';
import { invide_validation } from '../validation/invite_valida';
import { prisma } from 'db';
import { sendtounsigned } from '../external_api/resend';
const router = express.Router();


router.post("/invite",middleware, async (req, res) => {
    const userId=req.userId;
    if(!userId){
        return res.status(403).json({
            success:false,
            message:""
        })
    }
    const email=req.email;
    if(!email){
        return res.status(403).json({
            success:false,
            message:"Can,t Access the userId"
        })
    }
    const main=invide_validation.safeParse(req.body);
    if(!main.success){
        return res.status(403).json({
            success:false,
            message:"Please check the inputs"
        })
    }
    const {email,organizationId}=main.data;
    try {
        const find_orgnization=await prisma.membership.findMany({where:{organizationId:organizationId},select:{userId:true}});
        if(!find_orgnization){
            return res.status(403).json({
                success:false,
                message:"Organization not found! "
            })
        }
        const result=find_orgnization.forEach(x=>x.userId==userd);
        if(result==null){
            return res.status(403).json({
                success:false,
                message:"Access Denied!"
            })
        }
        const user_exist=await prisma.user.findUnique({where:{id:userId}});
        if(!user_exist){
            return res.status(403).json({
                success:false,
                message:"User not found !"
            })
        }
        sendtounsigned()
        return res.status(200).json({
            success:false,
            message:"Invite Send Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})







export default router;