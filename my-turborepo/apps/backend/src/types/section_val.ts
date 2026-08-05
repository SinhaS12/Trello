import z from 'zod';

export const section_validation=z.object({
    title:z.string(),
    boardId:z.string()
})