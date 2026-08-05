import z from 'zod';


export const get_issue=z.object({
    userId:z.string()
})