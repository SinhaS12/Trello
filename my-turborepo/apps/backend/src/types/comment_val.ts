import z from 'zod';


export const comments_validation=z.object({
    organizationId:z.string(),
    boardId:z.string(),
    sectionId:z.string(),
    issueId:z.string(),
    comment:z.string()
})