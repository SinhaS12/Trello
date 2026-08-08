import z from 'zod';

export const section_validation=z.object({
    title:z.string(),
    organizationId:z.string(),
    sectionId:z.string(),
    boardId:z.string()
})