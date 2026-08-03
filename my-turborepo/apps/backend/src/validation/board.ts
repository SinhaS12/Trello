
import z from 'zod';



export const board_validation=z.object({
    title:z.string(),
    organizationId:z.string()
})

export const board_delete=z.object({
    organizationId:z.string(),
    boardId:z.string()
})