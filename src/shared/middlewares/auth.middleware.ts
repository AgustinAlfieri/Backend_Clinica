import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../auth/auth.service.js';
import { checkPermissionMiddleware } from './checkPermissionMiddleware.js';

interface decodeData { userId: string; role: string; }

export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    //Agarro header
    const authHeader = req.headers.authorization;
    if (!authHeader) { res.status(401).json({ message: 'No autorizado' });  return;}

    //saco token y verifico
    const token =  authHeader.split(' ')[1];
    const decoded = verifyToken(token);

    //Agrego info del usuario al request
    (req as any).user = decoded as decodeData;

    //Chequeo dentro de authMiddleware - Ajuste por consulta con JA
    const entity = decoded.role;
    const action = req.body.action || '';

    checkPermissionMiddleware(entity, action);
    next();

  } catch (error) {
    res.status(401).json({ message: 'No autorizado' });
  }
};