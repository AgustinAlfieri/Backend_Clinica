import { NextFunction, Request, Response } from 'express';
import { verifyToken } from '../auth/auth.service.js';
import { checkPermissionMiddleware } from './checkPermissionMiddleware.js';
import { ResponseManager } from '../helpers/responseHelper.js';

interface decodeData {
  userId: string;
  role: string;
}

export const authMiddleware = (entity: string, action: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      //Agarro header
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        ResponseManager.unauthorized(res, 'Cabecera de autorización faltante.');
        return;
      }

      //saco token y verifico
      const token = authHeader.split(' ')[1];
      const decoded = verifyToken(token);

      //Agrego info del usuario al request
      (req as any).user = decoded as decodeData;

      if (entity && action) {
        const user = req.user;
        if (!user) {
          ResponseManager.error(res, 'Error interno en validación de usuario.', 'Validación de usuario fallida', 403);
          return;
        }
        checkPermissionMiddleware(user.role, entity, action);
      }
      next();
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Error desconocido de autenticación/permiso.';
      ResponseManager.error(res, [errorMsg], 'Fallo de autenticación.', 401);
      return;
    }
  };
};
