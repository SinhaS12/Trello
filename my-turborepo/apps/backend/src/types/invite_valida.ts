import z from 'zod';

export const invide_validation=z.object({
    userId:z.string(),
    organizationId:z.string(),
    email:z.string()
})


export const accept_validation=z.object({
    organizationId:z.string()
})