import { Collection, EntityManager } from '@mikro-orm/mysql';
import { TypeAppointmentStatus } from './typeAppointmentStatus.entity.js';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';
import { logger } from '../shared/logger/logger.js';

interface TypeAppointmentStatusDTO {
  name: string;
  appointmentsStatus: Collection<AppointmentStatus>;
}

export class TypeAppointmentStatusService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork();
    return await _em.find(TypeAppointmentStatus, {}, { populate: ['appointmentsStatus'] });
  }

  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(TypeAppointmentStatus, id, { populate: ['appointmentsStatus'] });
  }

  async create(tas: TypeAppointmentStatusDTO): Promise<TypeAppointmentStatus> {
    try {
      if (!tas.name) throw new Error('Faltan datos obligatorios');

      const _em = this.em.fork();
      //Creo el Tipo de estado del turno
      const newTAS = await _em.create(TypeAppointmentStatus, {
        name: tas.name
      });
      if (tas.appointmentsStatus) {
        const appointmentStatusCol = new Collection<AppointmentStatus>(newTAS);
        for (const appointmentStatusId of tas.appointmentsStatus) {
          const appointmentStatus = await _em.findOne(AppointmentStatus, appointmentStatusId);

          if (!appointmentStatus) throw new Error(`El estado de turno con id ${appointmentStatusId} no existe`);
          else appointmentStatusCol.add(appointmentStatus);
        }
        newTAS.appointmentsStatus = appointmentStatusCol;
      }

      _em.persistAndFlush(newTAS);
      return newTAS;
    } catch (error: any) {
      logger.error('Error al crear el Tipo de estado del turno', error);

      throw `Fallo al crear el Tipo de estado del turno: ${error.message || error.toString()}`;
    }
  }

  async update(id: string, tasUpdate: Partial<TypeAppointmentStatusDTO>): Promise<void> {
    try {
      const _em = this.em.fork();

      const result = await _em.nativeUpdate(TypeAppointmentStatus, { id }, tasUpdate);
    } catch (error: any) {
      logger.error('Error al actualizar Tipo de estado del turno', error);

      throw `Fallo al actualizar Tipo de estado del turno: ${error.message || error.toString()}`;
    }
  }

  async remove(id: string) {
    const _em = this.em.fork();
    const typeAppointmentStatus = await _em.findOne(TypeAppointmentStatus, id);

    if (!typeAppointmentStatus) {
      throw new Error('No se encontró el Tipo de estado del turno');
    }

    await _em.removeAndFlush(typeAppointmentStatus);
    return true;
  }
}
