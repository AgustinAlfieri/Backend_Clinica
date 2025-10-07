import { EntityManager } from "@mikro-orm/mysql";
import { TypeAppointmentStatus } from "./typeAppointmentStatus.entity.js";

interface TypeAppointmentStatusDTO {
    name: string;
}

export class TypeAppointmentStatusService {
    constructor(private _em: EntityManager) {}

    async findAll() {
        const _em = this._em.fork();
        return await _em.find(TypeAppointmentStatus, {}, {populate: ['appointmentStatus']});   
    }

    async findOne(id: string) {
        const _em = this._em.fork();
        return await _em.findOne(TypeAppointmentStatus, id, {populate: ['appointmentStatus']});
    }

    async create(typeAppointmentStatus: TypeAppointmentStatusDTO) {
        const _em = this._em.fork();
        const newTypeAppointmentStatus = new TypeAppointmentStatus();

        newTypeAppointmentStatus.name = typeAppointmentStatus.name;

        await _em.persistAndFlush(newTypeAppointmentStatus);
        return newTypeAppointmentStatus;
    }

    async update(id: string, typeAppointmentStatus: Partial<TypeAppointmentStatusDTO>) {
        const _em = this._em.fork();
        const existingTypeAppointmentStatus = await _em.findOne(TypeAppointmentStatus, id);
        

        if (!existingTypeAppointmentStatus) {
            throw new Error('No se encontró el estado de cita médica');
        }
        
        const newTypeAppointmentStatus = new TypeAppointmentStatus();
        
        newTypeAppointmentStatus.id = existingTypeAppointmentStatus.id;
        newTypeAppointmentStatus.name = typeAppointmentStatus.name || existingTypeAppointmentStatus.name;

        _em.assign(existingTypeAppointmentStatus, newTypeAppointmentStatus);
        await _em.flush();

        return existingTypeAppointmentStatus;
    }

    async remove(id: string) {
        const _em = this._em.fork();
        const typeAppointmentStatus = await _em.findOne(TypeAppointmentStatus, id);

        if (!typeAppointmentStatus) {
            throw new Error('No se encontró el estado de cita médica');
        }

        await _em.removeAndFlush(typeAppointmentStatus);
        return true;
    }
}