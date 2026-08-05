import express from 'express';
import { middleware } from '../middleware/middleware';
import { board_delete, board_rename, board_validation } from '../types/board_val';
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


route.post("/boardDelete", middleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({
            success: false,
            message: "Can,t Access the userId"
        })
    }
    const main = board_delete.safeParse(req.body);
    if (!main.success) {
        return res.status(403).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { organizationId, boardId } = main.data;
    try {
        const find_orgaizationId = await prisma.membership.findFirst({
            where: { organizationId: organizationId }, select: {
                userId: true
            }
        })
        if (!find_orgaizationId) {
            return res.status(403).json({
                success: false,
                message: "Organization Not found"
            })
        }
        if (userId != find_orgaizationId.userId) {
            return res.status(403).json({
                success: false,
                message: "Access Denied!"
            })
        }
        const find_board = await prisma.boards.findUnique({ where: { id: boardId }, select: { id: true } });
        if (!find_board) {
            return res.status(403).json({
                success: false,
                message: "Boards Not found !"
            })
        }
        const delete_the_board = await prisma.boards.delete({ where: { id: find_board.id } });
        return res.status(200).json({
            success: true,
            message: "Board deleted successfully",
            board: delete_the_board
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

route.get("/board", middleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({
            success: false,
            message: "Can,t Get the userId"
        })
    }
    try {
        const find_mine = await prisma
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})





route.put("/boardRename", middleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(403).json({
            success: false,
            message: "Can,t Access the user"
        })
    }
    const main = board_rename.safeParse(req.body);
    if (!main.success) {
        return res.status(403).json({
            success: false,
            message: "Please check the inputs "
        })
    }
    try {

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})






export default route;