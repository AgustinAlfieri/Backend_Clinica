import { Collection, EntityManager } from "@mikro-orm/mysql";
import { Administrative } from "./administrative.entity.js";
import { comparePassword, DataNewUser, hashPassword } from "../../../shared/auth/auth.service.js"
import { Appointment } from "../../../appointment/appointment.entity.js";
import { Role } from "../../../shared/enums/role.enum.js";

export class AdministrativeService {
    constructor(private em: EntityManager) {}

    async findAll() {
        const _em = this.em.fork();
        return await _em.find(Administrative, {}, { populate: ['appointments'] });
    }

    async findOne(id: string) {
        const _em = this.em.fork();
        return await _em.findOne(Administrative, id, { populate: ['appointments'] });
    }

    async create(administrative: Partial<DataNewUser>) : Promise<Administrative> {
        const _em = this.em.fork();
        const newAdministrative = new Administrative();

        if(!administrative.password || !administrative.email || !administrative.dni || !administrative.name) 
            throw new Error('Todos los campos son obligatorios');

        const existAdministrativeByDni = await _em.findOne(Administrative, { dni: administrative.dni });
        if(existAdministrativeByDni)
            throw new Error('Ya existe un administrativo con ese DNI');

        //Assign fields
        newAdministrative.dni = administrative.dni;
        newAdministrative.name = administrative.name;
        newAdministrative.email = administrative.email;
        (administrative.telephone) ? 
            newAdministrative.telephone = administrative.telephone : newAdministrative.telephone = undefined;

        //hash password
        newAdministrative.password =  await hashPassword(administrative.password);

        newAdministrative.appointments = new Collection<Appointment>(newAdministrative);
        if(administrative.appointments && administrative.appointments.length > 0) {
            for (const app of administrative.appointments) {
                const id = app.id;
                const appointment = await _em.findOne(Appointment, id || '-1');
                
                if (!appointment)
                    throw new Error('No se encontró la cita médica');

                newAdministrative.appointments.add(appointment);
            }
        }

        newAdministrative.role = Role.ADMINISTRATIVE;

        await _em.persistAndFlush(newAdministrative);
        return newAdministrative;
    }

    async update(id: string, administrative: Partial<DataNewUser>) : Promise<Administrative> {
        const _em = this.em.fork();
        const existingAdministrative = await _em.findOne(Administrative, id);
        const newAdministrativeData = new Administrative();

        newAdministrativeData.id = id;

        if (!existingAdministrative) {
            throw new Error('No se encontró el administrativo');
        }

        newAdministrativeData.dni = administrative.dni || existingAdministrative.dni;
        newAdministrativeData.name = administrative.name || existingAdministrative.name;
        newAdministrativeData.email = administrative.email || existingAdministrative.email;
        newAdministrativeData.telephone = administrative.telephone || existingAdministrative.telephone;

        if(administrative.password) {
            const isDistinct =  comparePassword(administrative.password, existingAdministrative.password);
            if(!isDistinct)
                newAdministrativeData.password = await hashPassword(administrative.password);
            else
                newAdministrativeData.password = existingAdministrative.password;
        } else {
            newAdministrativeData.password = existingAdministrative.password;
        }

        newAdministrativeData.appointments = new Collection<Appointment>(newAdministrativeData);
        if(administrative.appointments && administrative.appointments.length > 0) {
            for (const app of administrative.appointments) {
                const id = app.id;
                const appointment = await _em.findOne(Appointment, id || '-1');

                if (!appointment)
                    throw new Error('No se encontró la cita médica');

                newAdministrativeData.appointments.add(appointment);
            }
        }

        newAdministrativeData.role = Role.ADMINISTRATIVE;

        _em.assign(existingAdministrative, newAdministrativeData);
        _em.flush();

        return existingAdministrative;
    }

    async remove(id: string) : Promise<boolean> {
        const _em = this.em.fork();
        const existingAdministrative = await _em.findOne(Administrative, id);

        if (!existingAdministrative) {
            throw new Error('No se encontró el administrativo');
        }

        await _em.removeAndFlush(existingAdministrative);
        return true;
    }
}