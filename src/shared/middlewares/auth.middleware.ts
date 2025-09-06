import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../auth/auth.service.js';

interface decodeData { userId: string; role: string; }

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    //Agarro header
    const authHeader = req.headers.authorization;

    if (!authHeader) { res.status(401).json({ message: 'No autorizado' });  return;}

    //saco token y verifico
    const token =  authHeader.split(' ')[1];
    const decoded = verifyToken(token) as decodeData;

    //Agrego info del usuario al request
    (req as any).user = decoded;

    next();

  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
};