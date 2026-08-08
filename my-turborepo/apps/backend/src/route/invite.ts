import express from 'express';
import { middleware } from '../middleware/middleware';
import { accept_validation, invide_validation } from '../types/invite_valida';
import { prisma } from 'db';
import { sendtounsigned } from '../external_api/resend';
const router = express.Router();
router.use(middleware);



router.post("/invite", async (req, res) => {
    const userd = req.userId;
    if (!userd) {
        return res.status(400).json({
            success: false,
            message: "User not found !"
        })
    }
    const Email = req.email as string;
    if (!Email) {
        return res.status(404).json({
            success: false,
            message: "Can,t Access the userId"
        })
    }
    const main = invide_validation.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { userId, email, organizationId } = main.data;
    try {
        const find_orgnization = await prisma.membership.findMany({ where: { organizationId: organizationId }, select: { userId: true } });
        if (find_orgnization.length == 0) {
            res.status(404).json({
                success: false,
                message: "Organization not found! "
            })
            return;
        }
        const result = find_orgnization.forEach(x => x.userId == userd);
        if (result == null) {
            return res.status(403).json({
                success: false,
                message: "Access Denied!"
            })
        }
        const user_exist = await prisma.user.findUnique({ where: { id: userId } });
        if (!user_exist) {
            return res.status(404).json({
                success: false,
                message: "User not found !",
                link: sendtounsigned(Email, email)
            })
        }
        return res.status(200).json({
            success: true,
            message: "Invite Send Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})





router.post("/accept", async (req, res) => {
    const userId = req.userId as string;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const main = accept_validation.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { organizationId } = main.data;
    try {
        const is_org_exist = await prisma.organization.findUnique({ where: { id: organizationId } });
        if (!is_org_exist) {
            return res.status(404).json({
                success: false,
                message: "Organization does not exist!"
            })
        }
        await prisma.membership.create({
            data: {
                userId: userId,
                organizationId: organizationId
            }
        })
        return res.status(200).json({
            success: true,
            message: "Invite Accepted Successfully"
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})





export default router;