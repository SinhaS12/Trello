import { error } from 'console'
import type { Response, Request, NextFunction } from 'express';
import jwt, { type JwtPayload } from 'jsonwebtoken'
if (!process.env.JWT_SECRET) {
    throw error("Can,t Access the JWT_SECRET");
}
const jwt_pass = process.env.JWT_SECRET;

declare global {
    namespace Express {
        interface Request {
            email?: String,
            userId?:String
        }
    }
}


export function middleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Please enter the token!"
        })
    }
    try {
        const decode = jwt.verify(token, jwt_pass) as JwtPayload;
        if(!decode){
            return res.status(401).json({
                success:false,
                message:"Unauthorized !"
            })
        }
        req.email = decode.email;
        req.userId=decode.userId;
        next();
    } catch (error) {
        return res
    }
}