import express from 'express';
import { middleware } from '../middleware/middleware';
import { board_delete, board_get, board_rename, board_validation } from '../types/board_val';
import { prisma } from 'db';
import { useId } from 'react';
const route = express.Router();



route.post("/createBoard", middleware, async (req, res) => {
    const userId = req.userId;
    const main = board_validation.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { title, organizationId } = main.data;
    try {
        const is_org_exist = await prisma.organization.findUnique({ where: { id: organizationId } });
        if (!is_org_exist) {
            return res.status(404).json({
                success: false,
                message: "Organization does not exist"
            })
        }
        const new_board = await prisma.boards.findMany({
            where: { organizationId },
            select: {
                title: true
            }
        })
        if (new_board.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No boards details found"
            })
        }
        const boardExists = new_board.some(x => x.title === title);
        if (boardExists) {
            return res.status(409).json({
                success: false,
                message: "Board already exists"
            })
        }
        const make_board = await prisma.boards.create({
            data: {
                title,
                organization: {
                    connect: { id: organizationId }
                }
            }
        })
        return res.status(200).json({
            success: true,
            message: "Board Created Successfully",
            board: make_board
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
    const main = board_delete.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { organizationId, boardId } = main.data;
    try {
        const is_org_exist = await prisma.organization.findUnique({ where: { id: organizationId } });
        if (!is_org_exist) {
            return res.status(404).json({
                success: false,
                message: "Organization does not exist"
            })
        }
        const new_board = await prisma.boards.findMany({
            where: { organizationId },
            select: {
                id: true
            }
        })
        if (new_board.length == 0) {
            return res.status(404).json({
                success: false,
                message: "No boards details found"
            })
        }
        const boardExists = new_board.some(x => x.id === boardId);
        if (boardExists) {
            return res.status(409).json({
                success: false,
                message: "Board already exists"
            })
        }
        const make_board = await prisma.boards.delete({
            where: { id: boardId }, select: {
                id: true
            }
        })
        return res.status(200).json({
            success: true,
            message: "Board Created Successfully",
            board: make_board
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

route.get("/board", middleware, async (req, res) => {
    const userId = req.userId as string;
    const main=board_get.safeParse(req.body);
    if(!main.success){
        return res.status(400).json({
            success:false,
            message:"Please check the inputs"
        })
    }
    const {boardId}=main.data;
    try {
        const get_all=await prisma.membership.findMany({where:{userId:userId}});
        if(get_all.length==0){
            return res.status(404).json({
                success:false,
                message:"No membership found in any organization "
            })
        }
        const get_t_f=get_all.some(x=>x.id===boardId);
        if(!get_t_f){
            return res.status(404).json({
                success:false,
                message:"No board found"
            })
        }
        const data=await prisma.boards.findMany();
        return res.status(200).json({
            success:false,
            message:"Got all the board details",
            data:data
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})





route.put("/boardRename", middleware, async (req, res) => {
    const userId = req.userId as string;
    const main = board_rename.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
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