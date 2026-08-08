import express from 'express';
import { Delete_organization, Making_organization, rename_organization } from '../types/organization_val';
import { prisma } from 'db';
import { middleware } from '../middleware/middleware';
const route = express.Router();

route.post("/createOrganization", middleware, async (req, res) => {
    const userId = req.userId as string;
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
        const new_admin = await prisma.admin.create({
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
    const main = Delete_organization.safeParse(req.body);
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
                message: "Organization does not exist"
            })
        }
        const get_the_admin = await prisma.admin.findUnique({
            where: {
                organizationId: organizationId
            },
            select: {
                userId: true
            }
        });
        if (get_the_admin?.userId != userId) {
            return res.status(405).json({
                success: false,
                message: "Access denied"
            })
        }
        //can use transaction here but it also have some issues
        await prisma.admin.delete({
            where: { organizationId },
        })
        const delete_organization = await prisma.organization.delete({
            where: { id: organizationId },
            select: {
                id: true
            }
        })
        return res.status(200).json({
            success: true,
            message: "Organization Deleted Successfully",
            details: delete_organization.id
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
    try {
        const get_organization = await prisma.membership.findMany({ where: { userId }, select: { organizationId: true } });
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
    const main = rename_organization.safeParse(req.body);
    if (!main.success) {
        return res.status(400).json({
            success: false,
            message: "Please check the inputs"
        })
    }
    const { organizationId, title, description } = main.data;
    try {
        const is_org_exist = await prisma.organization.findUnique({ where: { id: organizationId } });
        if (!is_org_exist) {
            return res.status(404).json({
                success: false,
                message: "Organization does not exist"
            })
        }
        const admin_access = await prisma.admin.findUnique({ where: { organizationId }, select: { userId: true } });
        if (admin_access?.userId != userId) {
            return res.status(405).json({
                success: false,
                message: "Access denied"
            })
        }
        const rename_karo = await prisma.organization.update({
            where: { id: organizationId }, data: {
                title: title,
                description: description
            },
            select: {
                title: true,
                description: true
            }
        })
        return res.status(200).json({
            success: true,
            message: "Organization updated successfully",
            details: rename_karo

        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Internal Server Error"
        })
    }
})



export default route;