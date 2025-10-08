
//En clase de consulta se define que debido a la poca cantidad de roles y permisos, 
// se implementara un sistema de permisos basado en roles y acciones.

// TO-DO : Definir todos los posibles permisos
export enum actions {
    CREATE = 'create',
    DELETE = 'delete',
    UPDATE = 'update',
    VIEW = 'view'
};

export const rolesPermissions: Record<string, Record<string, string[]>> = 
{
    'Administrative' : {
        User: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
        Patient: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
        Medic: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
        Appointment: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
        AppointmentStatus: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW]
    },

    'Medic' : {
        User: [actions.VIEW, actions.UPDATE],
        Patient: [actions.VIEW, actions.UPDATE],
        Medic: [actions.VIEW, actions.UPDATE]
    },

    'Patient' : {
        User: [actions.VIEW],
        Patient: [actions.UPDATE],
        Medic: [actions.VIEW]
    },

    //User with all permissions
    'Administrator' : {
        User: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
        Patient: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW],
        Medic: [actions.CREATE, actions.DELETE, actions.UPDATE, actions.VIEW]
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