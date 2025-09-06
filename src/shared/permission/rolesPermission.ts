
//En clase de consulta se define que debido a la poca cantidad de roles y permisos, 
// se implementara un sistema de permisos basado en roles y acciones.
export const rolesPermissions: Record<string, Record<string, string[]>> = 
{
    'Administrative' : {
        User: ['create', 'delete', 'update', 'view'],
        Patient: ['create', 'delete', 'update', 'view'],
        Medic: ['create', 'delete', 'update', 'view'],
        Appointment: ['create', 'delete', 'update', 'view'],
        AppointmentStatus: ['create', 'delete', 'update', 'view']
    },
    'Medic' : {
        User: ['view', 'update'],
        Patient: ['view', 'update'],
        Medic: ['view', 'update']
    },
    'Patient' : {
        User: ['view'],
        Patient: ['update', 'viewOwnAppointments'],
        Medic: ['view']
    },
    //User with all permissions
    'Administrator' : {
        User: ['create', 'delete', 'update', 'view'],
        Patient: ['view', 'update', 'viewOwnAppointments'],
        Medic: ['view', 'update', 'viewOwnAppointments']
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