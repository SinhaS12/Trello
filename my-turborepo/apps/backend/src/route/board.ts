import express from 'express';
import { middleware } from '../middleware/middleware';
import { board_validation } from '../validation/board';
import { prisma } from 'db';
const route = express.Router();



route.post("/createBoard", middleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({
            success: false,
            message: "Can,t access the userId"
        })
    }
    const main = board_validation.safeParse(req.body);
    if (!main.success) {
        return res.status(403).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { title, organizationId } = main.data;
    try {
        const find_exist = await prisma.boards.findUnique({ where: { title } });
        if (!find_exist) {
            return res.status(403).json({
                success: false,
                message: "Board already exist"
            })
        }
        const create_new_boards = await prisma.boards.create({
            data: {
                title: title,
                organizationId: organizationId
            },
            select: {
                title: true
            }
        })
        return res.status(200).json({
            success: false,
            message: "Board Created Successfully",
            board: create_new_boards
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})
export default route;