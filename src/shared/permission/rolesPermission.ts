//En clase de consulta se define que debido a la poca cantidad de roles y permisos,
// se implementara un sistema de permisos basado en roles y acciones.

// TO-DO : Revisar permisos
export enum actions {
  CREATE = 'create',
  DELETE = 'delete',
  UPDATE = 'update',
  VIEW = 'view'
}

export const rolesPermissions: Record<string, Record<string, string[]>> = {
  // Administrativo: Puede realizar todas las acciones sobre todas las entidades
  Administrative: {
    Patient: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    Medic: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    Administrative: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    Appointment: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    AppointmentStatus: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    MedicalInsurance: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    MedicalSpecialty: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    Practice: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
    TypeAppointmentStatus: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW]
  },

  Medic: {
    Patient: [actions.VIEW, actions.UPDATE],
    Medic: [actions.VIEW, actions.UPDATE],
    Appointment: [actions.CREATE, actions.UPDATE, actions.VIEW],
    Practice: [actions.VIEW]
  },

  Patient: {
    Patient: [actions.UPDATE, actions.VIEW],
    Medic: [actions.VIEW],
    Appointment: [actions.CREATE, actions.UPDATE, actions.VIEW],
    MedicalInsurance: [actions.VIEW],
    MedicalSpecialty: [actions.VIEW],
    Practice: [actions.VIEW],
    AppointmentStatus: [actions.CREATE]
  }
};

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
