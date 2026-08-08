import expres from 'express';
import { middleware } from '../middleware/middleware';
import { get_issue } from '../types/issue_valid';
import { prisma } from 'db';
const route = expres.Router();
route.use(middleware);



route.post("/issue", async (req, res) => {

    try {

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


route.get("/issue", async (req, res) => {
    const main = get_issue.safeParse(req.body);
    if (!main.success) {
        return res.status(422).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { userId } = main.data;
    try {
        const get_all = await prisma.issueMapping.findMany({ where: { userId: userId } });
        if (get_all.length == 0) {
            return res.status(402).json({
                success: false,
                message: "No issue!"
            })
        }
        return res.status(200).json({
            success: true,
            message: "Issue fetched successfully"
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

route.get("/issue/:issueId", async (req, res) => {
    const issueId = req.params.issueId;
    if (!issueId) {
        return res.status(402).json({
            success: false,
            message: "Issue Id required!"
        })
    }
    const userId = req.userId;
    if (!userId) {
        return res.status(402).json({
            success: false,
            message: "Can,t Access the userId"
        })
    }
    try {
        
        const get_issue = await prisma.issue.findUnique({ where: { id: issueId }, select: { title: true,description:true } });
        if (!get_issue) {
            return res.status(402).json({
                success: false,
                message: "No issue found on this id"
            })
        }
        return res.status(200).json({
            success: true,
            message:"Issue got successfully",
            details:get_issue
        })


    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


route.delete("/issue/:issueId", async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

route.put("/issue_upadate", async (req, res) => {
    try {

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})


export default route;