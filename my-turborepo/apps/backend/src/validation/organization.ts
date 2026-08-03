import z from 'zod';



export const Making_organization=z.object({
    title:z.string(),
    description:z.string()
})