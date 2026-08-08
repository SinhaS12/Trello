import express from 'express';
import { Delete_organization, Making_organization, rename_organization } from '../types/organization_val';
import { prisma } from 'db';
import { middleware } from '../middleware/middleware';
const route = express.Router();

route.post("/createOrganization", middleware, async (req, res) => {
    const userId = req.userId as string;
    if (!userId) {
        return res.status(404).json({
            success: false,
            message: "Can,t access the email "
        })
    }
    const main = Making_organization.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs "
        })
    }
    const { title, description } = main.data;
    try {
        const exisiting = await prisma.organization.findUnique({ where: { title } });
        if (exisiting) {
            return res.status(409).json({
                success: false,
                message: "Organization already exists"
            })
        }
        const new_org = await prisma.organization.create({
            data: {
                title,
                description
            },
            select: {
                title: true,
                id: true
            }
        })
        const new_admin = await prisma.membership.create({
            data: {
                userId: userId,
                organizationId: new_org.id
            },
            select: {
                userId: true
            }
        })
        return res.status(200).json({
            success: true,
            message: "Organization made successfully",
            org_name: new_org.title,
            admin_id: new_admin.userId
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})
route.delete("/deleteOrganization", middleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(404).json({
            success: false,
            message: "Can,t Access the user"
        })
    }
    const main = Delete_organization.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }

    const { organizationId } = main.data;
    try {

        const powe_to_delete = await prisma.membership.findFirst({
            where: { organizationId: organizationId }, select: {
                userId: true,
                id: true
            }
        });
        if (!powe_to_delete) {
            return res.status(404).json({
                success: false,
                message: "Can,t find the organization"
            })
        }
        if (powe_to_delete.userId != userId) {
            return res.status(403).json({
                success: false,
                message: "Access Denied!"
            })
        }
        const delelted = await prisma.organization.delete({
            where: { id: powe_to_delete.id }, select: {
                title: true
            }
        });
        return res.status(200).json({
            success: true,
            message: "Organization Deleted Successfully",
            deleted: delelted.title
        })

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})

route.get("/organization", middleware, async (req, res) => {
    const userId = req.userId as string;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Can,t access the userId"
        })
    }
    try {
        const get_organization = await prisma.membership.findMany({ where: { userId },select:{organizationId:true} });
        return res.status(200).json({
            success: true,
            organizations: get_organization
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})



route.put("/renameOrganization", middleware, async (req, res) => {
    const userId = req.userId;
    if (!userId) {
        return res.status(400).json({
            success: false,
            message: "Can,t Access the user"
        })
    }
    const main = rename_organization.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { title, description } = main.data;
    try {
        const is_exist = await prisma.organization.findUnique({ where: { title } });
        if (!is_exist) {
            return res.status(404).json({
                success: false,
                message: "Can,t find the organization !"
            })
        }
        const updatedOrganization = await prisma.organization.update({
            where: { title },
            data: {
                title,
                description
            }
        });
        return res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            organization: updatedOrganization
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})



export default route;