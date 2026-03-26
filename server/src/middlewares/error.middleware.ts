import { Request,Response, NextFunction } from "express"


const errorHandler = (err: any,  req: Request , res: Response, next:NextFunction )=>{
    console.log(err);

    const status = err.status || 500;
    const message = err.message || "Internal server error";

    res.status(status).json({
        success: false,
        message
    })

}

export {errorHandler}