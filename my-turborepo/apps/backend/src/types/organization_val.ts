import z from 'zod';



export const Making_organization = z.object({
    title: z.string(),
    description: z.string()
})

export const Delete_organization = z.object({
    organizationId: z.string()
})


export const rename_organization=z.object({
    title:z.string().optional(),
    description:z.string().optional()
})