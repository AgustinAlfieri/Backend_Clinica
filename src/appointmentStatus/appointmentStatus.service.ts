import { EntityManager } from '@mikro-orm/core';
import { Appointment } from '../appointment/appointment.entity.js';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js';
import { logger } from '../shared/logger/logger.js';
import { resolveMessage } from '../shared/errorManagment/appError.js';

export interface AppointmentStatusData {
  appointment: string;
  appointmentStatusDate?: Date;
  observations?: string;
  typeAppointmentStatus: string;
}

export class AppointmentStatusService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork();
    return await _em.find(AppointmentStatus, {});
  }

  async findOne(id: string) {
    const _em = this.em.fork();
    return await _em.findOne(AppointmentStatus, id);
  }

  async create(data: AppointmentStatusData): Promise<AppointmentStatus> {
    try {
      const _em = this.em.fork();

      if (!data.appointment || !data.typeAppointmentStatus) {
        throw new Error('Turno y Tipo de estado de turno son obligatorios');
      }

      //Utilizamos getReference para traer una referencia al objeto en lugar de todo el objeto.
      //Queda la duda si para los arreglos no habría que reemplazar los findOne por esto
      const newappointment = _em.getReference(Appointment, data.appointment);
      const tas = _em.getReference(TypeAppointmentStatus, data.typeAppointmentStatus);

      const newAppointmentStatus = _em.create(AppointmentStatus, {
        date: data.appointmentStatusDate || new Date(),
        appointment: newappointment,
        typeAppointmentStatus: tas,
        observation: data.observations || ''
      });
      await _em.persistAndFlush(newAppointmentStatus);
      return newAppointmentStatus;
    } catch (error: any) {
      logger.error('Error al crear el estado de turno', error);

      throw `Fallo al crear el estado de turno: ${resolveMessage(error)}`;
    }
  }

  async update(id: string, data: AppointmentStatusData): Promise<void> {
    try {
      const _em = this.em.fork();

      _em.nativeUpdate(AppointmentStatus, { id }, data);
    } catch (error: any) {
      logger.error('Error al actualizar el estado de turno', error);

      throw `Fallo al actualizar el estado de turno: ${resolveMessage(error)}`;
    }
  }
  async remove(id: string): Promise<boolean> {
    const _em = this.em.fork();
    const appointment = await _em.findOne(Appointment, id);

    if (!appointment) {
      throw new Error('No se encontró el estado de turno');
    }

    await _em.removeAndFlush(appointment);
    return true;
  }
}
