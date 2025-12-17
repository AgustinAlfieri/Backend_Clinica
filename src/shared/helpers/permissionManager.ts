import { rolesPermissions } from '../permission/rolesPermission.js';

export class PermissionManager {
  static hasPermission(role: string, entity: string, action: string): boolean {
    //Obtenemos los permisos del rol
    const rolePermissions = rolesPermissions[role];

    //Si el rol no existe o no tiene permisos para la entidad, juira
    if (!rolePermissions || !rolePermissions[entity]) {
      return false;
    }

    return rolePermissions[entity].includes(action);
  }
}