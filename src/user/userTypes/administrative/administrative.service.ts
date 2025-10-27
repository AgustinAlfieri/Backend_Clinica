import { Collection, EntityManager } from '@mikro-orm/mysql';
import { Administrative } from './administrative.entity.js';
import { DataNewUser, hashPassword } from '../../../shared/auth/auth.service.js';
import { Appointment } from '../../../appointment/appointment.entity.js';
import { Role } from '../../../shared/enums/role.enum.js';
import { logger } from '../../../shared/logger/logger.js';
import { resolveMessage } from '../../../shared/errorManagment/appError.js';

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

  async create(administrative: DataNewUser): Promise<Administrative> {
    try {
      const _em = this.em.fork();
      
      // Validaciones básicas
      if (!administrative.dni && !administrative.email) {
        throw new Error('Debe ingresar dni o email');
      }
      if (!administrative.name || !administrative.password) {
        throw new Error('Faltan datos obligatorios');
      }
      // Crear el administrativo
      const newAdministrative = await _em.create(Administrative, {
        dni: administrative.dni,
        name: administrative.name,
        email: administrative.email,
        password: await hashPassword(administrative.password),
        telephone: administrative.telephone,
        role: Role.ADMINISTRATIVE
      });

      // Si viene con turnos, los busco y asigno
      if (administrative.appointments && administrative.appointments.length > 0) {
        for (const appointmentId of administrative.appointments) {
          const appointment = await _em.findOne(Appointment, appointmentId);
          if (!appointment) {
            throw new Error(`El turno con id ${appointmentId} no existe`);
          }
          newAdministrative.appointments.add(appointment);
        }
      }

      await _em.persistAndFlush(newAdministrative);
      return newAdministrative;
    } catch (error: any) {
      logger.error('Error al crear el administrativo', error);
      throw `Fallo al crear el administrativo: ${resolveMessage(error)}`;
    }
  }

  async update(id: string, administrativeUpdate: Partial<DataNewUser>): Promise<void> {
    try {
      const _em = this.em.fork();
      // Si quiere actualizar la password, la hasheo
      if (administrativeUpdate.password)
        administrativeUpdate.password = await hashPassword(administrativeUpdate.password);

      _em.nativeUpdate(Administrative, { id }, administrativeUpdate);

    } catch (error: any) {
      logger.error('Error al actualizar administrativo', error);

      throw `Fallo al actualizar administrativo: ${resolveMessage(error)}`;
    }
  }

  async remove(id: string) {
    try {
      const _em = this.em.fork();
      const administrative = await _em.findOneOrFail(Administrative, id);

      await _em.removeAndFlush(administrative);
      
      return administrative;
    } catch (error: any) {
      logger.error('Error al eliminar administrativo', error);
      
      throw `Error al eliminar administrativo: ${resolveMessage(error)}`;
    }
  }
}
