import express from 'express';
import { section_validation } from '../types/section_val';
import { middleware } from '../middleware/middleware';
import { prisma } from 'db';
const route = express();
route.use(middleware);




route.post("/createSection", async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Can,t access the userId"
        })
    }
    const main = section_validation.safeParse(req.body);
    if (!main.success) {
        return res.status(402).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { organizationId, title, sectionId,boardId } = main.data;
    try {
        const is_exist = await prisma.section.findUnique({ where: { id: sectionId } });
        if (is_exist) {
            return res.status(409).json({
                success: false,
                message: "Section id already exist"
            })
        }
        const is_ownere = await prisma.membership.findMany({ where: { organizationId: organizationId }, select: { userId: true } });
        if (is_ownere.length == 0) {
            return res.status(400).json({
                success: false,
                message: "Can,t access the organizastion id"
            })
        }
        const is_it = is_ownere.filter(i => i.userId === userId);
        if (!is_it) {
            return res.status(404).json({
                success: false,
                message: "Not id"
            })
        }
       
        return res.status(200).json({
            success: true,
            message: "new section made successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


route.get("/section", async (req, res) => {
    try {
        const get_mine_only=await prisma
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})



route.put("/sectionRename", async (require, res) => {
    try {

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})



route.delete("/sectionDelete", async (require, res) => {
    try {

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        })
    }
})



export default route;