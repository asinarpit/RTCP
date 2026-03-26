import { Response, NextFunction } from "express"
import { AuthRequest } from "../types/auth-request"
import jwt from "jsonwebtoken"

const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({
                message: "No token provided"
            })
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(401).json({
                message: "Invalid token format"
            })
        }

        //verifying token
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string, email: string };

        req.user = decoded;

        next();

    } catch (err) {
        res.status(401).json({
            message: "Unauthorized or invalid token"
        })
    }
}


export {protect}