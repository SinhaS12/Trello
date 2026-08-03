import z from 'zod';

export const signup_validation=z.object({
    email:z.string(),
    name:z.string(),
    password:z.string()
})


export const signin_validation=z.object({
    email:z.string(),
    password:z.string()
})
