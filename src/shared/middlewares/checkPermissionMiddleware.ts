import { Request, Response, NextFunction} from "express";
import { PermissionManager } from "../permission/rolesPermission.js";

declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      role: string;  //necesito tener el rol para poder verificar permisos despues
    };
  }
}

export function checkPermissionMiddleware(entity: string, action: string) {
    return (req: Request, res: Response, next: NextFunction) => {
        const user = req.user;

        if (!user) {
            res.status(403).json({ message: 'Error en validación de permisos de usuario' });
            return;
        }

        if(!PermissionManager.hasPermission(user.role, entity, action)) {
            res.status(403).json({ message: 'No tienes permiso para realizar esta acción' });
            return;
        }

        next();
    }
}