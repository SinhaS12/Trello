
import z from 'zod';



export const board_validation=z.object({
    title:z.string(),
    organizationId:z.string()
})