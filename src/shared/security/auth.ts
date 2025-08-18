import { StatusCodes } from "http-status-codes";
import jwt from "jsonwebtoken";
import { AppError } from "../errorManagment/appError.js";
import { orm } from "../database/orm.js";
import { User } from "../../user/user.entity.js";
import { generateToken } from "./generateToken.js";
import { Request, Response, NextFunction } from "express";

const em = orm.em;

function verifyToken(req: Request, res: Response, next: NextFunction){
    const header = req.headers["autorization"] as string | undefined;
    const token = header && header.split(" ")[1];

    if(!token)
    {
        return res.status(StatusCodes.FORBIDDEN).send(); 
    }

    try
    {
        const decoded = jwt.verify(token, process.env.SECRET || "default");
        //TO-DO: add data in body
        (req as any).user = decoded;
        next();
    }
    catch(err)
    {
        throw new AppError("", StatusCodes.UNAUTHORIZED);
    }

    return;
}

async function login(res: Response, req: Request){
    const { dni } = req.body;
    
    //find user
    em.findOne(User, dni)
                        .then(() => {
                            const token = generateToken({ dni });
                            return res.status(StatusCodes.ACCEPTED).send({token});
                        })
                        .catch((err) => {
                            return res.status(StatusCodes.UNAUTHORIZED).json({ error: err.message});
                        })
 
    return;
}

export { verifyToken, login }