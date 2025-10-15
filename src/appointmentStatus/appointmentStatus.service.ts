import { EntityManager } from '@mikro-orm/core';
import { Appointment } from '../appointment/appointment.entity.js';
import { AppointmentStatus } from '../appointmentStatus/appointmentStatus.entity.js';
import { TypeAppointmentStatus } from '../typeAppointmentStatus/typeAppointmentStatus.entity.js'

export interface AppointmentStatusData {
  appointments: string;
  appointmentStatusDate?: Date;
  observations?: string;
  typeAppointmentStatus: string;
}

export class AppointmentStatusService {
  constructor(private em: EntityManager) {}

  async findAll() {
    const _em = this.em.fork(); 
    return await _em.find( 
      AppointmentStatus, 
      {}, 
      {
        populate: ['appointment','typeAppointmentStatus']
      } 
    );
  }

  async findOne(id: string) {
      const _em = this.em.fork();
      return await _em.findOne(AppointmentStatus, id, {
        populate: ['appointment','typeAppointmentStatus']
      });
    }


  async create(data: AppointmentStatusData): Promise<AppointmentStatus> {
    const _em = this.em.fork();
  
    if (!data.appointments || !data.typeAppointmentStatus) {
      throw new Error('Turno y Tipo de estado de turno son obligatorios');
    }

    const appointment = await _em.findOne(Appointment, data.appointments);
    if (!appointment) throw new Error('No se encontró el turno');

    const type = await _em.findOne(TypeAppointmentStatus, data.typeAppointmentStatus);
    if (!type) throw new Error('No se encontró el tipo de estado de turno');

    const newAppointmentStatus = _em.create(AppointmentStatus, {
      date: data.appointmentStatusDate || new Date(),
      appointment: appointment,
      typeAppointmentStatus: type,
      observation: data.observations || ''
    });

    await _em.persistAndFlush(newAppointmentStatus);
    return newAppointmentStatus;
  }

  async update(id: string, data: AppointmentStatusData): Promise<AppointmentStatus> {
    const _em = this.em.fork();
    const existingAppointmentStatus = await _em.findOne(AppointmentStatus, id, {
      populate: ['appointment','typeAppointmentStatus']
    });
  
    if (!existingAppointmentStatus) {
        throw new Error('No se encontró el estado de turno');
    }
  
    // Actualizar fecha si se proporciona
    if (data.appointmentStatusDate) {
      existingAppointmentStatus.date = data.appointmentStatusDate;
    }

    if (data.observations) {
      existingAppointmentStatus.observation = data.observations;
    }
  
    // Actualizar paciente si se proporciona
    if (data.appointments) {
      const appointment = await _em.findOne(Appointment, data.appointments);
      if (!appointment) throw new Error('No se encontró el turno');
      existingAppointmentStatus.appointment = appointment;
    }
    if (data.typeAppointmentStatus) {
      const tas = await _em.findOne(TypeAppointmentStatus, data.typeAppointmentStatus);
      if (!tas) throw new Error('No se encontró el turno');
      existingAppointmentStatus.typeAppointmentStatus = tas;
    }
    await _em.flush();
    return existingAppointmentStatus;
  }
  async remove(id: string): Promise<boolean> {
    const _em = this.em.fork();
    const appointment = await _em.findOne(Appointment, id);

    if (!appointment) {
      throw new Error('No se encontró el turno');
    }

    await _em.removeAndFlush(appointment);
    return true;
  }
}

