import { Request, Response, NextFunction } from 'express';
import { PermissionManager } from '../permission/rolesPermission.js';

declare module 'express' {
  export interface Request {
    user?: {
      id: string;
      role: string; //necesito tener el rol para poder verificar permisos despues
    };
  }
}

export function checkPermissionMiddleware(userRole: string, entity: string, action: string) {
  if (!PermissionManager.hasPermission(userRole, entity, action)) {
    throw new Error('No tienes permiso para realizar esta acción');
  }
}
